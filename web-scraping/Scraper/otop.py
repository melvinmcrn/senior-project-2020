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
    start_urls = ['https://www.thaitambon.com/product/3363']

    def parse(self, response, page_idx=1):
        for product in response.css('div.product.clearfix'):
            product_url = product.css('div.product-image a img::attr(src)').extract_first()
            product_id = str(product_url).strip().split('/')[-1]
            pathlib.Path("otop").mkdir(parents=True, exist_ok=True)
            path = pathlib.Path() / "otop" / product_id
            r = requests.get(product_url, stream=True)
            sleep(0.5)
            if r.status_code == 200:
                with open(path, 'wb') as f:
                    r.raw.decode_content = True
                    shutil.copyfileobj(r.raw, f)
        next_page = response.css('li.active a::attr("href")').get()
        print(next_page)

        if next_page is not None:
            next_page_base = next_page.strip().split('/')
            next_page_base[-1] = str(int(next_page_base[-1]) + 1)
            next_page = '/'.join(next_page_base)
            yield response.follow(next_page, self.parse)


    def parse_category(self, response):
        result = []

        # for i, gun in zip(range(len(response.css('li.gallerybox div.thumb div a'))), response.css('li.gallerybox div.thumb div a')):
        #    # result.append({
        #    #      "image_urls": 'http://www.imfdb.org' + gun.css('img::attr(src)').extract_first(),
        #    #      "image_category":response.css('h1.firstHeading span::text').get().split(":")[1]
        #    #  })
        #    category = response.css('h1.firstHeading span::text').get().split(":")[1]
        #    pathlib.Path(category).mkdir(parents=True, exist_ok=True)
        #    path = pathlib.Path() / category / f'img_{category}_{i}.jpeg'
        #    r = requests.get('http://www.imfdb.org' + gun.css('img::attr(src)').extract_first(), stream=True)
        #    if r.status_code == 200:
        #        with open(path, 'wb') as f:
        #            r.raw.decode_content = True
        #            shutil.copyfileobj(r.raw, f)
        # product_id = str(response).strip().split('/')[-1]
        # print(product_id)
        # pathlib.Path("otop").mkdir(parents=True, exist_ok=True)
        # path = pathlib.Path() / "otop" / product_id
        # r = requests.get(product_url, stream=True)
        # if r.status_code == 200:
        #     with open(path, 'wb') as f:
        #         r.raw.decode_content = True
        #         shutil.copyfileobj(r.raw, f)
        #
        # print(result)
        # print(len(result))

if __name__ == "__main__":
    os.system("scrapy runspider C:\\Users\\NSQ NB 00044\\Desktop\\web-scraping\\Scraper\\otop.py")