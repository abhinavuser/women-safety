import cv2
import os
from inference_sdk import InferenceHTTPClient
import time

# Initialize the client once
CLIENT = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="kLvuP8kL8bWktjLADNte"
)

def detect_violence(frame):
    # Save frame to a temporary file for model input
    temp_path = "temp_frame.jpg"
    # Resize frame for faster processing but with adjustable quality
    frame_resized = cv2.resize(frame, (640, 360))  # Experiment with resolution if detection fails
    cv2.imwrite(temp_path, frame_resized)
    
    try:
        # Perform synchronous inference and get result
        result = CLIENT.infer(temp_path, model_id="violence-detection-p71sl/2")
        
        # Check for predictions with class 'Violence' and confidence > 0.5
        predictions = result.get('predictions', [])
        violence_detected = any(pred['class'] == 'Violence' and pred['confidence'] > 0.5 for pred in predictions)
        
        if violence_detected:
            print("DEBUG: Violence detected with predictions:", predictions)  # Debug message for confirmation
        
        return violence_detected
    except Exception as e:
        print(f"ERROR: Model inference failed - {e}")
        return False
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

def process_video(video_path):
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    frame_skip = 15  # Reduced to process every 15 frames for quicker detection response
    frame_count = 0
    violence_detected = False  # Track violence detection status

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1
            
            # Process every nth frame for violence detection
            if frame_count % frame_skip == 0:
                violence_detected = detect_violence(frame)
                if violence_detected:
                    print("Violence detected!")
                    # Update frame if violence is detected
                    cv2.putText(frame, 'Violence Detected!', (50, 50), 
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

            # Show the live video feed, marking frames if violence was detected
            display_frame = frame.copy()
            if violence_detected:
                cv2.putText(display_frame, 'Violence Detected!', (50, 50), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            
            cv2.imshow('Video Feed', display_frame)

            # Break the loop if 'q' is pressed
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    finally:
        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    video_path = 'viole.mp4'  # Replace with your video path
    process_video(video_path)
