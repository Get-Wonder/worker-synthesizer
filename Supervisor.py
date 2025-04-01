import psutil
import os
from time import sleep
import sys
from subprocess import run, PIPE, DEVNULL

processName = sys.argv[1]
print('processName', processName)

def getPID():
    pid = 0
    for proc in psutil.process_iter():
        if proc.name() == processName:
            try:
                pinfo = proc.as_dict(attrs=['pid'])
            except psutil.NoSuchProcess:
                pid = 0
            else:
                pid = pinfo["pid"]
    try:
        res = psutil.Process(pid)
    except:
        res = psutil.Process(0)
    return res

def get_window_ids(window_name):
    """Get window IDs using wmctrl"""
    try:
        result = run(['wmctrl', '-l'], stdout=PIPE, text=True)
        windows = result.stdout.split('\n')
        window_ids = []
        for win in windows:
            if window_name in win:
                window_ids.append(win.split()[0])
        return window_ids
    except FileNotFoundError:
        print("wmctrl is not installed. Please install it using:")
        print("sudo apt-get install wmctrl")
        return []

def close():
    try:
        window_ids = get_window_ids(processName)
        for window_id in window_ids:
            run(['wmctrl', '-ic', window_id], stderr=DEVNULL)
    except:
        pass

def closeSupervisor():
    try:
        window_ids = get_window_ids("Administrator:  Supervisor")
        for window_id in window_ids:
            run(['wmctrl', '-ic', window_id], stderr=DEVNULL)
    except:
        pass

def restart():
    close()
    sleep(1)
    # Modify the command to run the equivalent .sh script instead of .bat
    script_name = processName + '.sh'
    if os.path.exists(script_name):
        os.system('bash ' + script_name)
        print("Restarted")
    else:
        print(f"Warning: {script_name} not found")

attempts = 0
checks = 0

while 1:
    sleep(0.5)
    p = getPID()
    try:
        usage = psutil.cpu_percent(interval=0.5)
        print('usage', usage)
        if usage <= 8:
            print('usage is <= 8', usage)
            print('checks', checks)
            checks = checks + 1
            if checks > 40:
                checks = 0
                attempts = attempts + 1
                if attempts > 2:
                    close()
                    closeSupervisor()
                    break
                else:
                    restart()
        else:
            checks = 0
    except:
        pass