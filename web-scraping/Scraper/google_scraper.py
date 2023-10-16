import scrapy
import pathlib
import requests
import shutil
import os
from time import sleep

ITEM_PIPELINES = {'scrapy.pipelines.images.ImagesPipeline': 1}

class ImgData(scrapy.Item):
    image_urls=scrapy.Field()
    images=scrapy.Field()
    image_category=scrapy.Field()

class BlogSpider(scrapy.Spider):
    name = 'blogspider'
    kw = "Gun"
    start_urls = ["https://www.google.com/search?q=gun&authuser=1&sxsrf=ALeKk01yWa5XpfGuR3GNNay9QgzaBSt4fg:1612957197920&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiOqMfmnd_uAhWclEsFHd-UAGYQ_AUoAXoECBIQAw&biw=1366&bih=657#imgrc=inzz-aCeEMDI2M"]

    def parse(self, response, page_idx=1):
        print("hey1", response.css('img.rg_i'))
        for i, product in enumerate(response.css('img.rg_i')):

            product_url = product.css('img::attr(src)').extract_first()
            product_id = product_url.split('/')[-1]
            pathlib.Path("google").mkdir(parents=True, exist_ok=True)
            pathlib.Path("google\\Gun").mkdir(parents=True, exist_ok=True)
            path = pathlib.Path() / "google" / "Gun" / f'google_{i}.jpeg'
            r = requests.get(product_url, stream=True)
            sleep(0.5)
            if r.status_code == 200:
                with open(path, 'wb') as f:
                    r.raw.decode_content = True
                    shutil.copyfileobj(r.raw, f)
        # next_page = response.css('li.active a::attr("href")').get()
        # print(next_page)
        #
        # if next_page is not None:
        #     next_page_base = next_page.strip().split('/')
        #     next_page_base[-1] = str(int(next_page_base[-1]) + 1)
        #     next_page = '/'.join(next_page_base)
        #     yield response.follow("https://www.hdnicewallpapers.com"+next_page, self.parse)

    def parse_category(self, response):
        result = []

        for i, gun in zip(range(len(response.css('li.gallerybox div.thumb div a'))), response.css('li.gallerybox div.thumb div a')):
           # result.append({
           #      "image_urls": 'http://www.imfdb.org' + gun.css('img::attr(src)').extract_first(),
           #      "image_category":response.css('h1.firstHeading span::text').get().split(":")[1]
           #  })
           category = response.css('h1.firstHeading span::text').get().split(":")[1]
           pathlib.Path(category).mkdir(parents=True, exist_ok=True)
           path = pathlib.Path() / category / f'img_{category}_{i}.jpeg'
           r = requests.get('http://www.imfdb.org' + gun.css('img::attr(src)').extract_first(), stream=True)
           if r.status_code == 200:
               with open(path, 'wb') as f:
                   r.raw.decode_content = True
                   shutil.copyfileobj(r.raw, f)
        print(result)
        print(len(result))

