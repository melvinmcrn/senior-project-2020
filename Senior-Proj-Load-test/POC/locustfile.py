import random
from locust import HttpUser, task, between
import json


def create_mock_image_list():
    file = open("valset_2021-02-22.csv", "r")
    file.readline()
    image_url_array = []
    for line in file:
        temp = line.strip().split(",")[0][5:]
        url = "https://storage.googleapis.com/" + temp
        image_url_array.append(url)

    return image_url_array


class SellerUser(HttpUser):
    wait_time = between(1, 2.5)

    def __init__(self, parent):
        super().__init__(parent)
        self.image_array = []
        self.image_id = []
        self.system_endpoint = "https://asia-southeast2-poc-innovation-iot.cloudfunctions.net"

    def on_start(self):
        self.image_array = create_mock_image_list()

    @task(3)    
    def upload_image_behavior(self):
        picked_image_urls = random.choices(self.image_array, k=random.randint(1,5))
        for picked_image_url in picked_image_urls:
            response = self.client.post(f"{self.system_endpoint}/validation"
                             ,data={"image_url": picked_image_url})
            self.image_id.append(json.loads(response.text)['image_id'])

    @task
    def get_validation_result(self):
        picked_image_id = random.choice(self.image_id)
        response = self.client.get(f"{self.system_endpoint}/result?image_id={picked_image_id}", name="/result")
        print(json.loads(response.text))


class AdminUser(HttpUser):
    wait_time = between(1, 2.5)

    def __init__(self, parent):
        super().__init__(parent)
        self.image_array = []
        self.uncertain_image_id = []
        self.system_endpoint = "https://asia-southeast2-poc-innovation-iot.cloudfunctions.net"
        self.admin_endpoint = "https://asia-southeast2-poc-innovation-iot.cloudfunctions.net"

    def on_start(self):
        self.image_array = create_mock_image_list()

    @task(5)
    def upload_image_behavior(self):
        picked_image_urls = random.choices(self.image_array, k=random.randint(1,5))
        for picked_image_url in picked_image_urls:
            self.client.post(f"{self.system_endpoint}/validation"
                             , data={"image_url": picked_image_url})

    @task
    def get_uncertain_image(self):
        response = self.client.get(f"{self.admin_endpoint}/uncertain_list")
        self.uncertain_image_id = json.loads(response.text)

    @task
    def update_uncertain_image(self):
        picked_uncertain_image_ids = random.choices(self.uncertain_image_id, k=random.randint(1, 5))
        response = self.client.post(f"{self.admin_endpoint}/update_uncertain",
                                    data={
                                        "data": [
                                            {"ImageId": image_id, "status": random.choice(["PASS", "BAN"])}
                                                 for image_id in picked_uncertain_image_ids

                                        ]
                                    }
        )

        print(json.loads(response.text))




# run command: locust -f locustfile [UserClass]