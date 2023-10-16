import scrapy


class ImfdbItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class ImgData(scrapy.Item):
    image_urls=scrapy.Field()
    images=scrapy.Field()
