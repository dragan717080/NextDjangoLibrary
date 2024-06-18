from abc import ABC
import os
import requests
import json
from datetime import datetime, timedelta
from requests.models import Response
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
import os
from dotenv import dotenv_values
import base64
import io

config = dotenv_values(".env")

class Utils(ABC):
    """
    Class of toolkit functions.
    """
    @staticmethod
    def upload_to_file_io(
        file: str|InMemoryUploadedFile,
        expires: datetime = None,
    ) -> str:
        """
        Upload file to file.io and get its link

        For free plan limits are one year and max_downloads = 1 (default)

        Args:
            file: str|InMemoryUploadedFile - either location of file or file
            expires: datetime - optional expiration date (default 52 weeks)

        Returns:
            link: str - Link of the uploaded file
        """
        url = 'https://file.io'
        if expires:
            url = '%s?expires=%s' % (url, expires)
        else:
            expires = datetime.now() + timedelta(weeks=52)

        # Convert datetime to ISO format string 
        expires = expires.isoformat()

        if type(file) == 'str':
            dirname = os.path.dirname(os.path.realpath(__file__))
            file_location = f"{dirname}\{file}"

            if os.path.exists(file_location):
                with open(file_location, 'rb') as f:
                    data = { 'expires': expires }
                    res = requests.post(
                        url,
                        files={ 'file': f },
                        data=data
                    )

            else:
                raise ValueError(f"File {file_location} was not found")

            return Utils.__handle_upload(res)

        else:
            data = { 'expires': expires }
            res = requests.post(
                        url,
                        files={ 'file': file },
                        data=data
                    )

            # IMPORTANT: set pointer back to the beginning of file so it can get reused later and not get consumed
            file.seek(0)

            return Utils.__handle_upload(res)

    @staticmethod
    def __handle_upload(res: Response) -> str:
        try:
            res.raise_for_status()
        except:
            print(f"There was an error uploading file: {res.json()['message']}")
            raise
        else:
            da = res.text
            daa = json.loads(da)
            print("your link is >>> " + daa["link"])
            return daa["link"]

    @staticmethod
    # Image file is the one passed via form
    def save_user_avatar(
        avatar_file: InMemoryUploadedFile,
        username: str
    ) -> str|None:
        # Resize the image to fit image dimensions from args
        # Convert the file to a Pillow Image
        img = Image.open(avatar_file)
        if 'A' in img.getbands():
            img = img.convert('RGBA')
        resized_img = img.resize((400, 400), Image.Resampling.LANCZOS)
        # Use a temporary local file to simulate a downloaded image
        dirname = os.path.dirname(os.path.realpath(__file__))
        file_name = f"{dirname}\\{username}.png"
        resized_img.save(file_name)

        return file_name

    @staticmethod
    def save_avatar(
        avatar: InMemoryUploadedFile,
    ) -> str:
        IMGUR_ID = config['IMGUR_ID']

        url = "https://api.imgur.com/3/image"
        headers = {"Authorization": f"Client-ID {IMGUR_ID}"}

        img = Image.open(avatar)

        # Convert image to bytes
        buffered = io.BytesIO()
        img.save(buffered, format=img.format)
        img_bytes = buffered.getvalue()

        # Encode as base64
        base64_data = base64.b64encode(img_bytes).decode('utf-8')

        # Upload image to Imgur and get URL
        response = requests.post(url, headers=headers, data={"image": base64_data})
        url = response.json()["data"]["link"]

        return url
