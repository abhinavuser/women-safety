from flask import Flask, jsonify, Response
from flask_cors import CORS
import cv2
import mediapipe as mp
import time
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# MediaPipe setup for hand detection
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
hands = mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.5)

# Initialize variables
sos_detected = False
last_gesture_time = time.time()
gesture_state = 0
current_message = "Waiting for hand..."

# Function to check finger state
def check_finger_state(hand_landmarks, hand_label):
    finger_tips = [8, 12, 16, 20]
    finger_bases = [5, 9, 13, 17]
    fingers_open = []
    fingers_close_together = True

    for i, (tip, base) in enumerate(zip(finger_tips, finger_bases)):
        if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[base].y:
            fingers_open.append(True)
        else:
            fingers_open.append(False)

        if i > 0:
            previous_tip = finger_tips[i - 1]
            if abs(hand_landmarks.landmark[tip].x - hand_landmarks.landmark[previous_tip].x) > 0.05:
                fingers_close_together = False

    if hand_label == "Right":
        thumb_visible = hand_landmarks.landmark[4].x < hand_landmarks.landmark[3].x
    else:
        thumb_visible = hand_landmarks.landmark[4].x > hand_landmarks.landmark[3].x

    return fingers_open, fingers_close_together, thumb_visible

# Function to detect SOS gesture and generate video frames
def generate_frames():
    global sos_detected, gesture_state, last_gesture_time, current_message

    cap = cv2.VideoCapture(0)
    while True:
        success, image = cap.read()
        if not success:
            break

        image = cv2.flip(image, 1)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = hands.process(image_rgb)

        # Process hand landmarks for SOS detection
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                
                # Analyze gesture based on hand landmarks
                fingers_open, fingers_close_together, thumb_visible = check_finger_state(hand_landmarks, "Right")
                gesture_detected = "Intermediate Hand Position"
                
                if not thumb_visible and all(fingers_open) and fingers_close_together:
                    gesture_detected = "Fingers Open, Thumb Tucked, Fingers Together"
                elif not thumb_visible and all(not finger for finger in fingers_open) and fingers_close_together:
                    gesture_detected = "Fingers Closed, Thumb Tucked, Fingers Together"
                
                current_time = time.time()
                if thumb_visible:
                    gesture_state = 0
                    current_message = "Thumb Visible - Resetting"
                elif gesture_state == 0 and gesture_detected == "Fingers Closed, Thumb Tucked, Fingers Together":
                    current_message = "Fingers Closed - Step 1"
                    gesture_state = 1
                    last_gesture_time = current_time
                elif gesture_state == 1 and gesture_detected == "Fingers Open, Thumb Tucked, Fingers Together":
                    current_message = "Fingers Open - Step 2"
                    gesture_state = 2
                    last_gesture_time = current_time
                elif gesture_state == 2 and gesture_detected == "Fingers Closed, Thumb Tucked, Fingers Together":
                    current_message = "SOS Gesture Detected!"
                    sos_detected = True
                    last_gesture_time = current_time
                elif current_time - last_gesture_time > 3:
                    gesture_state = 0
                    current_message = "Waiting for hand..."

        # Overlay current message on the image
        cv2.putText(image, current_message, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        # Encode the frame for streaming
        ret, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

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
    sos_detected = False  # Reset after responding
    return response

if __name__ == '__main__':
    app.run(port=5001)
