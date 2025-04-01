import pyautogui
from time import sleep

def get_mouse_position():
    sleep(5)
    x, y = pyautogui.position()
    print(f"Mouse position: x={x}, y={y}")


get_mouse_position()