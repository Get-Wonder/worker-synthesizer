import argparse
import pyautogui
from unidecode import unidecode
import subprocess
from time import sleep
from subprocess import call
from pysndfx import AudioEffectsChain
import os

parser = argparse.ArgumentParser()
parser.add_argument('--phonetics')
parser.add_argument('--count')
args = parser.parse_args()

synthetizer_path = "/root/Downloads/IONOS/Synthesizer V Studio Pro/scripts"
window_name = 'Synthesizer V Studio Pro - avocados.svp'
phonetics = args.phonetics
count = args.count

pyautogui.FAILSAFE = False

print("ENTRO AL APP.PY")



# pid = get_pid_by_window_title(window_name)
# if pid:
#     print(f"Found window '{window_name}' with PID: {pid}")

# success = focus_window_by_title(window_name)
# if success:
#     print(f"Successfully focused window: {window_name}")

# hwnd = win32gui.FindWindow(None, window_name)
# force_focus_window(hwnd)

# for x in pyautogui.getAllWindows():
#     print(x.title)

# print('windowName', window_name)

# win32gui.ShowWindow(hwnd, win32con.SW_MAXIMIZE)
# win32gui.SetForegroundWindow(hwnd)

def focus_window(window_name):
    os.system('xdotool search --name "Synthesizer V Studio Pro - avocados.svp" | xargs xdotool windowactivate')
    print("intentando focusear pantalla")
    

focus_window(window_name)

def edit_js(phonetics, count):
    with open(f"{synthetizer_path}/synthetizer_v.js", "r") as archivo:
        lineas = archivo.readlines()
        lineas[11] = f'var phrase = "{phonetics}"\n'
        lineas[12] = f'var count = {count}\n'

    with open(f"{synthetizer_path}/synthetizer_v.js", "w") as archivo:
        archivo.writelines(lineas)

def run_script():
    # RESCAN
    pyautogui.moveTo(455, 75)
    pyautogui.click()
    sleep(0.1)

    pyautogui.moveTo(468, 106)
    x, y = pyautogui.position()
    sleep(0.1)
    
    print(f"Mouse position: x={x}, y={y}")
    pyautogui.click()
    sleep(0.1)
    pyautogui.moveTo(455, 75)
    x, y = pyautogui.position()
    
    print(f"Mouse position: x={x}, y={y}")
    pyautogui.click()

    sleep(0.1)
    pyautogui.moveTo(488, 209)
    x, y = pyautogui.position()
    
    print(f"Mouse position: x={x}, y={y}")
    pyautogui.click()
    sleep(0.1)

    # SCRIPT RM
    # file
    pyautogui.moveTo(20, 80)
    x, y = pyautogui.position()
    
    print(f"Mouse position: x={x}, y={y}")
    pyautogui.click()
    sleep(0.1)
    #save
    pyautogui.moveTo(31, 173)
    x, y = pyautogui.position()
    
    print(f"Mouse position: x={x}, y={y}")
    pyautogui.click()
    sleep(0.1)
    # pyautogui.moveTo()(23, 33)
    # x, y = pyautogui.position()
    
    # print(f"Mouse position: x={x}, y={y}")
    # pyautogui.click()
    # sleep(0.1)
    # pyautogui.moveTo()(65, 126)
    # x, y = pyautogui.position()
    
    # print(f"Mouse position: x={x}, y={y}")
    # pyautogui.click()
    # sleep(0.1)

def synth_render():
    # pyautogui.moveTo()(941, 201)
    # x, y = pyautogui.position()
    
    # print(f"Mouse position: x={x}, y={y}")
    # pyautogui.click()
    # pyautogui.click()
    # pyautogui.write("jingle")
    # sleep(0.1)
    # pyautogui.moveTo()(939, 236)
    # x, y = pyautogui.position()
    
    # print(f"Mouse position: x={x}, y={y}")
    # pyautogui.click()
    # sleep(0.1)
    # pyautogui.moveTo()(19, 24)
    # x, y = pyautogui.position()
    
    # print(f"Mouse position: x={x}, y={y}")
    # pyautogui.click()
    # sleep(0.1)
    pyautogui.moveTo(1696, 276)
    x, y = pyautogui.position()
    
    print(f"Mouse position: x={x}, y={y}")
    pyautogui.click()
    sleep(3)

    # pyautogui.moveTo()(1243, 9)
    # pyautogui.click()
    # sleep(0.1)



edit_js(phonetics, count)
sleep(0.5)
# test_pyautogui()
run_script()
synth_render()
