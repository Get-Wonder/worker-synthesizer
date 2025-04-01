import requests
import json
from time import sleep

class KitsApi:
    def kitsInference(self):
        url = 'https://arpeggi.io/api/kits/v1/voice-conversions'
        headers = {
            "Authorization": "Bearer 7GmxFP-h.IEBaYPB7e5f4kS5WQjru_XJi"
        }
        payload = {
            "voiceModelId": "1079651", #1079651
            "conversionStrength": 0.88,
            "modelVolumeMix": 0.75,
            "pitchShift": 6
        }
        files=[
            ('soundFile',(f'{self.filepath}.wav',open(f'bin/tmp/{self.filepath}.wav','rb'),'application/octet-stream'))
        ]

        response = requests.request("POST", url, headers=headers, data=payload, files=files)
        response = response.content.decode("utf-8")
        response = json.loads(response)
        return str(response["id"])

    def kitsJob(self, job_id):
        url = 'https://arpeggi.io/api/kits/v1/voice-conversions/'+job_id
        headers = {
            "Authorization": "Bearer 7GmxFP-h.IEBaYPB7e5f4kS5WQjru_XJi"
        }

        response = requests.request("GET", url, headers=headers)
        response = response.content.decode("utf-8")
        response = json.loads(response)
        return response["outputFileUrl"]

    def kitsAudio(self, link):
        url = link
        response = requests.request("GET", url)
        open(f"bin/tmp/kits_{self.filepath}.wav", "wb").write(response.content)

    def __init__(self, filepath):
        self.filepath = filepath
        self.job_id = self.kitsInference()
        self.audiolink = self.kitsJob(self.job_id)
        while self.audiolink == None:
            sleep(5)
            self.audiolink = self.kitsJob(self.job_id)
        self.kitsAudio(self.audiolink)
