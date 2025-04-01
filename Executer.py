import json
import shutil
import pathlib
import sys
import os
from os import remove, system, listdir, chdir
from subprocess import call, run, PIPE
from time import sleep

# Get command line argument
name = sys.argv[1]

print("EXECUTER PY", name)

# Set path based on condition
path = ''
if name == "Administrator:  Render":
    # Adjust the path for Linux environment
    path = "/home/amaze/Desktop/output/jingle_MixDown.wav"

print('path', path, 'name', name)

def close_window(window_name):
    """
    Close window using wmctrl (Linux window manager control)
    First tries exact match, then falls back to partial match
    """
    try:
        # List all windows
        result = run(['wmctrl', '-l'], stdout=PIPE, text=True)
        windows = result.stdout.split('\n')
        
        # Try to find exact match first
        window_id = None
        for win in windows:
            if window_name in win:
                window_id = win.split()[0]
                break
        
        if window_id:
            # Close the window using its ID
            run(['wmctrl', '-ic', window_id])
        else:
            print(f"Window '{window_name}' not found")
            
    except FileNotFoundError:
        print("wmctrl is not installed. Please install it using:")
        print("sudo apt-get install wmctrl")
        sys.exit(1)

# Read and execute command from file
try:
    with open('command.txt') as f:
        contents = f.read()
        print(contents)
        system(contents)
except FileNotFoundError:
    print("command.txt not found")
    sys.exit(1)

# Wait for command execution
sleep(1)

# Check if output file exists and close windows
print('os.path.isfile(path)', os.path.isfile(path))
if os.path.isfile(path):
    close_window("Administrator:  Supervisor")
    close_window(name)