import scrapy
import pathlib
import requests
import shutil

ITEM_PIPELINES = {'scrapy.pipelines.images.ImagesPipeline': 1}

class ImgData(scrapy.Item):
    image_urls=scrapy.Field()
    images=scrapy.Field()
    image_category=scrapy.Field()

class BlogSpider(scrapy.Spider):
    name = 'blogspider'
    start_urls = ['http://www.imfdb.org/wiki/Category:Gun']

    def parse(self, response):
        sub_category = response.css('center')
        for guns in sub_category.css('table tr td'):
            if guns.css('ul'):
                for gun in guns.css('li a'):
                    yield response.follow(gun, self.parse_category)

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

