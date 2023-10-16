import pathlib
# import base64
from selenium import webdriver
import time
from tqdm import tqdm
import urllib.request
import requests
import os
import hashlib
from getpass import getuser
# import shutil

# please provide your own chrome driver

# window
DRIVER_PATH = 'C:\\Users\\NSQ NB 00044\\OWASP ZAP\\webdriver\\windows\\32\\chromedriver.exe'
# mac os
DRIVER_PATH_MAC = '/Users/melvin/Documents/web-scraping/chromedriver'

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

driver = webdriver.Chrome(executable_path=DRIVER_PATH_MAC, options=chrome_options)
pathlib.Path("google").mkdir(parents=True, exist_ok=True)

## for window
# pathlib.Path(f"google\\{inp}").mkdir(parents=True, exist_ok=True)

# for mac
# pathlib.Path(f"google/{inp}").mkdir(parents=False, exist_ok=True)

# directory = pathlib.Path() / "google" / str(inp)
# url = 'https://www.google.com/search?q=' + str(
#     inp) + '&source=lnms&tbm=isch&sa=X&ved=2ahUKEwie44_AnqLpAhUhBWMBHUFGD90Q_AUoAXoECBUQAw&biw=1920&bih=947'



# def scroll_to_end(wd, scroll_point):
#     wd.execute_script(f"window.scrollTo(0, {scroll_point});")
#     time.sleep(.5)
#
# def find_urls(inp, url, driver, iterate):
#     driver.get(url)
#     time.sleep(3)
#     imgurls = driver.find_elements_by_class_name('rg_i')
#
#     for i, imgurl in tqdm(enumerate(imgurls)):
#         try:
#             # encode base64 into bytes
#             image_byte = bytes(imgurl.get_attribute('src').split(',')[1], 'utf-8')
#
#             # decode bytes and save as image
#             with open(directory / f"{inp}_{i}.jpeg", "wb") as fh:
#                 fh.write(base64.decodebytes(image_byte))
#         except (AttributeError, IndexError) as e:
#             print(e)
#         scroll_to_end(driver, i*1000)
#
#     # for i in tqdm(range(1, iterate+1)):
#     #         # scroll_to_end(driver, j*1000)
#     #         # imgurl = driver.find_element_by_xpath(
#     #         #     '//div//div//div//div//div//div//div//div//div//div[' + str(j) + ']//a[1]//div[1]//img[1]')
#     #
#     #         imgurl = imgurls[]
#     #         print(imgurl)
#     #         try:
#     #             # encode base64 into bytes
#     #             image_byte = bytes(imgurl.get_attribute('src').split(',')[1], 'utf-8')
#     #
#     #             # decode bytes and save as image
#     #             with open(directory / f"{inp}_{i}.jpeg", "wb") as fh:
#     #                 fh.write(base64.decodebytes(image_byte))
#     #         except (AttributeError, IndexError):
#     #             print(imgurl)
#
#     print("Finish scraping the image")


def fetch_image_urls(query: str, max_links_to_fetch: int, wd: webdriver, sleep_between_interactions: int = 1):
    def scroll_to_end(wd):
        wd.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(sleep_between_interactions)

        # build the google query

    search_url = "https://www.google.com/search?safe=off&site=&tbm=isch&source=hp&q={q}&oq={q}&gs_l=img"

    # load the page
    wd.get(search_url.format(q=query))

    image_urls = set()
    image_count = 0
    results_start = 0
    while image_count < max_links_to_fetch:
        scroll_to_end(wd)

        # get all image thumbnail results
        thumbnail_results = wd.find_elements_by_css_selector("img.Q4LuWd")
        number_results = len(thumbnail_results)

        print(f"Found: {number_results} search results. Extracting links from {results_start}:{number_results}")

        for img in thumbnail_results[results_start:number_results]:
            # try to click every thumbnail such that we can get the real image behind it
            try:
                img.click()
                time.sleep(sleep_between_interactions)
            except Exception:
                continue

            # extract image urls
            actual_images = wd.find_elements_by_css_selector('img.n3VNCb')
            for actual_image in actual_images:
                if actual_image.get_attribute('src') and 'http' in actual_image.get_attribute('src'):
                    image_urls.add(actual_image.get_attribute('src'))

            image_count = len(image_urls)

            if len(image_urls) >= max_links_to_fetch:
                print(f"Found: {len(image_urls)} image links, done!")
                break
        else:
            print("Found:", len(image_urls), "image links, looking for more ...")
            time.sleep(30)
            # return
            load_more_button = wd.find_element_by_css_selector(".mye4qd")
            if load_more_button:
                wd.execute_script("document.querySelector('.mye4qd').click();")

        # move the result startpoint further down
        results_start = len(thumbnail_results)

    return image_urls


def persist_image(file_name:str, url:str):
    try:
        image_content = requests.get(url)

    except Exception as e:
        print(f"ERROR - Could not download {url} - {e}")

    try:

        folder_path = pathlib.Path() / "google" / file_name

        if os.path.exists(folder_path):
            file_path = folder_path / f'{hashlib.sha1(image_content.content).hexdigest()[:10]}.jpg'
        else:
            os.mkdir(folder_path)
            file_path = folder_path / f'{hashlib.sha1(image_content.content).hexdigest()[:10]}.jpg'
        urllib.request.urlretrieve(url, file_path)
        print(f"\nSUCCESS - saved {url} - as {file_path}")
    except Exception as e:
        print(f"\nERROR - Could not save {url} - {e}")


if __name__ == '__main__':
    # find_urls(inp, url, driver, iterate)

    driver = webdriver.Chrome(executable_path=DRIVER_PATH_MAC, options=chrome_options)

    # get search keyword
    while True:
        inp = input("Enter what you wanna search? ")
        if inp and inp != '':
            break
        else:
            print("Error: Please input the valid keyword!")

    # get amount of wanted pics
    while True:
        try:
            iterate = int(input("Enter how many pics? "))
            if iterate > 0:
                break
            else:
                print("Error: Please input the integers where > 0 !")
        except ValueError:
            print("Error: Please input the integers where > 0 !")

    query_images = fetch_image_urls(query=inp, max_links_to_fetch=iterate, wd=driver)

    for query_image in tqdm(query_images):
        persist_image(inp, query_image)

    driver.quit()

