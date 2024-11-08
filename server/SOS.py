from flask import Flask, jsonify, Response
from flask_cors import CORS
import cv2
import mediapipe as mp
import time
from collections import defaultdict

app = Flask(__name__)
CORS(app)

# MediaPipe setup
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
hands = mp_hands.Hands(min_detection_confidence=0.6, min_tracking_confidence=0.4)

# Initialize tracking variables
hand_states = defaultdict(lambda: {"state": 0, "last_time": time.time(), "message": "Waiting...", "color": (255, 255, 255)})
sos_detected = False
global_message = "Waiting for SOS gesture..."

def check_finger_state(hand_landmarks):
    finger_tips = [8, 12, 16, 20]  # Index, Middle, Ring, Pinky tips
    finger_bases = [5, 9, 13, 17]  # Corresponding bases
    fingers_open = []
    fingers_close_together = True
    
    for i, (tip, base) in enumerate(zip(finger_tips, finger_bases)):
        # Check if finger is open
        if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[base].y - 0.02:
            fingers_open.append(True)
        else:
            fingers_open.append(False)
        
        # Check fingers proximity
        if i > 0:
            previous_tip = finger_tips[i - 1]
            if abs(hand_landmarks.landmark[tip].x - hand_landmarks.landmark[previous_tip].x) > 0.04:
                fingers_close_together = False

    all_fingers_open = all(fingers_open) and fingers_close_together
    all_fingers_closed = all(not finger for finger in fingers_open) and fingers_close_together
    return all_fingers_open, all_fingers_closed

def get_hand_id(hand_landmarks):
    wrist = hand_landmarks.landmark[0]
    return f"{wrist.x:.2f}_{wrist.y:.2f}"

def draw_status_box(image, text, position, color=(255, 255, 255), filled=False):
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.7
    thickness = 2
    padding = 10
    
    # Get text size
    (text_width, text_height), _ = cv2.getTextSize(text, font, font_scale, thickness)
    
    # Calculate box coordinates
    x, y = position
    box_coords = [
        (x - padding, y - text_height - padding),
        (x + text_width + padding, y + padding)
    ]
    
    # Draw box
    if filled:
        cv2.rectangle(image, box_coords[0], box_coords[1], color, -1)
        text_color = (0, 0, 0)
    else:
        cv2.rectangle(image, box_coords[0], box_coords[1], color, thickness)
        text_color = color
        
    # Draw text
    cv2.putText(image, text, (x, y), font, font_scale, text_color, thickness)

def generate_frames():
    global sos_detected, global_message
    cap = cv2.VideoCapture(0)

    while True:
        success, image = cap.read()
        if not success:
            break

        # Process image
        image = cv2.flip(image, 1)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)
        current_time = time.time()

        # Clear overlay for fresh drawing
        overlay = image.copy()

        # Clean up old hand states
        hands_to_remove = [hand_id for hand_id, data in hand_states.items() 
                         if current_time - data["last_time"] > 2]
        for hand_id in hands_to_remove:
            del hand_states[hand_id]

        # Draw global status
        status_color = (0, 255, 0) if sos_detected else (255, 255, 255)
        draw_status_box(overlay, global_message, (10, 30), status_color, filled=sos_detected)

        if results.multi_hand_landmarks:
            for idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
                # Draw hand landmarks with custom style
                mp_drawing.draw_landmarks(
                    overlay,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style()
                )

                hand_id = get_hand_id(hand_landmarks)
                fingers_open, fingers_closed = check_finger_state(hand_landmarks)
                hand_data = hand_states[hand_id]
                hand_data["last_time"] = current_time

                # State machine logic with visual feedback
                if hand_data["state"] == 0:
                    if fingers_closed:
                        hand_data["state"] = 1
                        hand_data["message"] = "Hand Closed - Step 1"
                        hand_data["color"] = (255, 165, 0)  # Orange
                elif hand_data["state"] == 1:
                    if fingers_open:
                        hand_data["state"] = 2
                        hand_data["message"] = "Hand Open - Step 2"
                        hand_data["color"] = (0, 255, 255)  # Yellow
                    elif not fingers_closed:
                        hand_data["state"] = 0
                        hand_data["message"] = "Waiting..."
                        hand_data["color"] = (255, 255, 255)  # White
                elif hand_data["state"] == 2:
                    if fingers_closed:
                        hand_data["message"] = "SOS Detected!"
                        hand_data["color"] = (0, 255, 0)  # Green
                        sos_detected = True
                        global_message = f"SOS Detected by Hand {idx + 1}!"
                    elif not fingers_open:
                        hand_data["state"] = 0
                        hand_data["message"] = "Waiting..."
                        hand_data["color"] = (255, 255, 255)

                # Draw hand status
                wrist_pos = hand_landmarks.landmark[0]
                text_pos = (
                    int(wrist_pos.x * image.shape[1]) - 100,
                    int(wrist_pos.y * image.shape[0]) - 20
                )
                draw_status_box(
                    overlay,
                    f"Hand {idx + 1}: {hand_data['message']}",
                    text_pos,
                    hand_data["color"],
                    filled=hand_data["state"] > 0
                )

        # Blend overlay with original image
        image = cv2.addWeighted(overlay, 0.9, image, 0.1, 0)

        ret, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/run_sos_model', methods=['GET'])
def run_sos_model():
    global sos_detected
    response = jsonify({"sos_detected": sos_detected})
    sos_detected = False
    return response

if __name__ == '__main__':
    app.run(port=5001)