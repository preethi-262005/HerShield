from flask import Flask, Response
from flask_cors import CORS
import cv2
import math
from ultralytics import YOLO
from playsound import playsound
import threading
import time

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Load the YOLO model
model = YOLO("yolov8n.pt")

# Define object classes
classNames = ["person", "bicycle", "car", "motorbike", "aeroplane", "bus", "train", "truck", "boat",
              "traffic light", "fire hydrant", "stop sign", "parking meter", "bench", "bird", "cat",
              "dog", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "backpack", "umbrella",
              "handbag", "tie", "suitcase", "frisbee", "skis", "snowboard", "sports ball", "kite", "baseball bat",
              "baseball glove", "skateboard", "surfboard", "tennis racket", "bottle", "wine glass", "cup",
              "fork", "knife", "spoon", "bowl", "banana", "apple", "sandwich", "orange", "broccoli",
              "carrot", "hot dog", "pizza", "donut", "cake", "chair", "sofa", "pottedplant", "bed",
              "diningtable", "toilet", "tvmonitor", "laptop", "mouse", "remote", "keyboard", "cell phone",
              "microwave", "oven", "toaster", "sink", "refrigerator", "book", "clock", "vase", "scissors",
              "teddy bear", "hair drier", "toothbrush"]

# Capture video from the default webcam
cap = cv2.VideoCapture(0)

# Function to play alarm sound in a separate thread
def play_alarm():
    playsound("D:\\women sheild\\backend\\alarm.mp3")  # Ensure correct path and extension

def process_video():
    alarm_triggered = False  # Track if alarm is already playing

    while True:
        success, img = cap.read()
        if not success:
            break

        results = model(img)

        # Variable to track cell phone detection
        cell_phone_detected = False

        for r in results:
            boxes = r.boxes

            for box in boxes:
                # Bounding box
                x1, y1, x2, y2 = map(int, box.xyxy[0])

                # Draw bounding box
                cv2.rectangle(img, (x1, y1), (x2, y2), (255, 0, 255), 3)

                # Confidence
                confidence = math.ceil((box.conf[0] * 100)) / 100

                # Class name
                cls = int(box.cls[0])
                className = classNames[cls]

                # Annotate frame with class name and confidence
                cv2.putText(img, f'{className} ({confidence})', (x1, y1), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)

                # Detect cell phone
                if className == "cell phone":
                    cell_phone_detected = True
                    print("Cell phone detected.")  # Debugging log

        # Check if cell phone was detected
        if cell_phone_detected and not alarm_triggered:
            alarm_triggered = True
            threading.Thread(target=play_alarm).start()  # Play alarm in separate thread
            print("Alarm triggered!")  # Debugging log

        # Reset the alarm if no cell phone is detected
        if not cell_phone_detected and alarm_triggered:
            alarm_triggered = False  # Reset the flag if the cell phone is no longer detected
            print("Alarm reset.")  # Debugging log

        # Encode the frame as JPEG
        ret, buffer = cv2.imencode('.jpg', img)
        frame = buffer.tobytes()

        # Yield the frame as part of a video stream
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(process_video(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
