from flask import Flask, jsonify, Response
from flask_cors import CORS
import cv2
import mediapipe as mp
import time
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# MediaPipe setup for hand detection
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(min_detection_confidence=0.6, min_tracking_confidence=0.4)

# Initialize tracking variables
hand_states = defaultdict(lambda: {"state": 0, "last_time": time.time(), "message": "Waiting..."})
sos_detected = False
global_message = "Waiting for SOS gesture..."

# Helper function to check finger states
def check_finger_state(hand_landmarks):
    # Finger tip and base landmark indices
    finger_tips = [8, 12, 16, 20]
    finger_bases = [5, 9, 13, 17]
    fingers_open = []
    fingers_close_together = True
    
    # Determine if fingers are open and close together
    for i, (tip, base) in enumerate(zip(finger_tips, finger_bases)):
        # Check if tip is above base (finger open)
        if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[base].y - 0.02:
            fingers_open.append(True)
        else:
            fingers_open.append(False)
        
        # Check if consecutive fingers are close together
        if i > 0:
            previous_tip = finger_tips[i - 1]
            if abs(hand_landmarks.landmark[tip].x - hand_landmarks.landmark[previous_tip].x) > 0.04:
                fingers_close_together = False

    # Return the overall state of fingers (open or closed)
    all_fingers_open = all(fingers_open) and fingers_close_together
    all_fingers_closed = all(not finger for finger in fingers_open) and fingers_close_together
    return all_fingers_open, all_fingers_closed

# Helper function to get hand ID based on wrist position
def get_hand_id(hand_landmarks):
    # Use wrist position as an identifier for tracking the hand
    wrist = hand_landmarks.landmark[0]
    return f"{wrist.x:.2f}_{wrist.y:.2f}"

# Video frame generator function for real-time hand gesture detection
def generate_frames():
    global sos_detected, global_message
    cap = cv2.VideoCapture(0)

    while True:
        success, image = cap.read()
        if not success:
            break

        # Flip and convert image for processing
        image = cv2.flip(image, 1)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)
        current_time = time.time()

        # Remove outdated hand states (older than 2 seconds)
        hands_to_remove = [hand_id for hand_id, data in hand_states.items() if current_time - data["last_time"] > 2]
        for hand_id in hands_to_remove:
            del hand_states[hand_id]

        if results.multi_hand_landmarks:
            for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
                mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                # Get unique hand ID for tracking
                hand_id = get_hand_id(hand_landmarks)

                # Check finger states
                fingers_open, fingers_closed = check_finger_state(hand_landmarks)

                # Update hand's last seen time
                hand_states[hand_id]["last_time"] = current_time

                # Process gesture states for each hand
                hand_data = hand_states[hand_id]
                if hand_data["state"] == 0 and fingers_closed:
                    hand_data["state"] = 1
                    hand_data["message"] = "Hand Closed - Step 1"
                elif hand_data["state"] == 1:
                    if fingers_open:
                        hand_data["state"] = 2
                        hand_data["message"] = "Hand Open - Step 2"
                    elif not fingers_closed:
                        hand_data["state"] = 0
                        hand_data["message"] = "Waiting..."
                elif hand_data["state"] == 2:
                    if fingers_closed:
                        hand_data["message"] = "SOS Detected!"
                        sos_detected = True
                        global_message = f"SOS Detected by Hand {idx + 1}!"
                        break
                    elif not fingers_open:
                        hand_data["state"] = 0
                        hand_data["message"] = "Waiting..."

                # Display the specific hand's message on the video
                wrist_pos = hand_landmarks.landmark[0]
                text_x, text_y = int(wrist_pos.x * image.shape[1]), int(wrist_pos.y * image.shape[0])
                cv2.putText(image, f"Hand {idx + 1}: {hand_data['message']}", (text_x - 100, text_y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 2)

        # Display global message on the video stream
        cv2.putText(image, global_message, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Encode the frame for streaming
        ret, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

# Flask endpoint for video streaming
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Flask endpoint to check SOS detection
@app.route('/run_sos_model', methods=['GET'])
def run_sos_model():
    global sos_detected
    response = jsonify({"sos_detected": sos_detected})
    sos_detected = False  # Reset SOS flag after response
    return response

if __name__ == '__main__':
    app.run(port=5001)
