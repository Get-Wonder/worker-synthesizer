import argparse
import win32gui
import win32con
import pyautogui
from unidecode import unidecode
from time import sleep
from subprocess import call
from pysndfx import AudioEffectsChain
from bin.kits import KitsApi

parser = argparse.ArgumentParser()
parser.add_argument('--name', type=str)
args = parser.parse_args()

vowels = ["a", "e", "i", "o", "u", "á", "é", "í", "ó", "ú"]
synthetizer_path = "C:/Users/Administrator/Documents/Dreamtonics/Synthesizer V Studio/scripts"
window_name = 'Synthesizer V Studio Pro - canto.svp'
name = args.name

hwnd = win32gui.FindWindow(None, window_name)
win32gui.ShowWindow(hwnd, win32con.SW_MAXIMIZE)
win32gui.SetForegroundWindow(hwnd)

def text_from_syllables(text):
    syllables = []
    tmp_syllable = []
    new_text = text.replace(" ", "")+"."
    for i, letter in enumerate(new_text):
        if i+1 < len(new_text):
            if letter in vowels and new_text[i+1] not in vowels or letter in ["á", "é", "í", "ó", "ú"]:
                tmp_syllable.append(unidecode(letter))
                syllables.append("".join(tmp_syllable))
                tmp_syllable = []

            elif letter not in vowels and new_text[i+1] not in vowels and tmp_syllable == []:
                if i == 0:
                    tmp_syllable.append(letter)
                else:
                    syllables[-1] = syllables[-1]+letter

            else:
                tmp_syllable.append(letter)

    return syllables

def generate_name():
	syllables = text_from_syllables(name)

	new_text = []
	if len(syllables) > 4:
		syllables = ["".join(syllables[0:-2]), syllables[-2], syllables[-1]]
		new_text = [
			syllables[0],
			syllables[1][0:-1] if syllables[1][-1] not in vowels else syllables[1],
			syllables[1][-2]+syllables[1][-1] if syllables[1][-1] not in vowels else syllables[1][-1],
			syllables[-1]
		]

	elif len(syllables) == 4:
		new_text = syllables

	elif len(syllables) == 3:
		new_text = [
			syllables[0],
			syllables[1][0:-1] if syllables[1][-1] not in vowels else syllables[1],
			syllables[1][-2]+syllables[1][-1] if syllables[1][-1] not in vowels else syllables[1][-1],
			syllables[-1]
		]

	elif len(syllables) == 2:
		new_text = syllables+syllables

	else:
		tmp_text = []
		for letter in syllables[0]:
			tmp_text.append(letter)
			if letter in vowels:
				new_text.append("".join(tmp_text))
				tmp_text = [letter]
		new_text.append("".join(tmp_text))
		new_text = new_text+new_text

	return new_text

def reverb(infile, outfile):
    fx = (
        AudioEffectsChain()
        .reverb(
            reverberance=85, #75
            hf_damping=50, #50
            room_scale=90, #90
            stereo_depth=100,
            pre_delay=0,
            wet_gain=0,
            wet_only=False)
        )

    fx(infile, outfile)

def edit_js(name):
	with open(f"{synthetizer_path}/synthetizer_v_2.js", "r") as archivo:
		lineas = archivo.readlines()
		lineas[2] = f'var a = "{name[0]}"\n'
		lineas[3] = f'var b = "{name[1]}"\n'
		lineas[4] = f'var c = "{name[2]}"\n'
		lineas[5] = f'var d = "{name[3]}"\n'

	with open(f"{synthetizer_path}/synthetizer_v_2.js", "w") as archivo:
	    archivo.writelines(lineas)

def run_script():
	# RESCAN
	pyautogui.moveTo(468, 33)
	pyautogui.click()
	sleep(0.1)
	pyautogui.moveTo(469, 63)
	pyautogui.click()

	# SCRIPT RM
	pyautogui.moveTo(468, 33)
	pyautogui.click()
	sleep(0.1)
	pyautogui.moveTo(496, 279)
	pyautogui.click()
	sleep(0.1)
	pyautogui.hotkey('ctrl', 's')
	sleep(0.1)

def synth_render():
	pyautogui.moveTo(2377, 204)
	pyautogui.click()
	pyautogui.click()
	pyautogui.write("cumpleanos")
	sleep(0.1)
	pyautogui.moveTo(2354, 234)
	pyautogui.click()
	sleep(0.1)

edit_js(generate_name())
run_script()
synth_render()
KitsApi("canto_MixDown")
call(f"ffmpeg -y -i bin/tmp/kits_canto_MixDown.wav -acodec pcm_s16le -ar 44100 -ac 2 bin/tmp/name-44100.wav")
call("ffmpeg -y -f concat -safe 0 -i bin/audios2.txt bin/tmp/noreverb.wav")
reverb("bin/tmp/noreverb.wav", f"Output/output.wav")
