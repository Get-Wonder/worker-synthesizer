import argparse
from time import sleep
from subprocess import call
import pyautogui

pyautogui.FAILSAFE = False

def test_pyautogui():
    sleep(10)
    pyautogui.moveTo(465, 35)
    x, y = pyautogui.position()
    print(f"Mouse position: x={x}, y={y}")

    pyautogui.moveTo(600, 50)
    pyautogui.write("test")
    x, y = pyautogui.position()
    print(f"Mouse position: x={x}, y={y}")

test_pyautogui()