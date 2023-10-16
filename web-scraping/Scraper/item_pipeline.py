from itemadapter import ItemAdapter
from scrapy.exporters import CsvItemExporter

class GunCSVExportPipeline:
    """Distribute items across multiple CSV files according to their 'category' field"""

    def open_spider(self, spider):
        self.category = {}

    def close_spider(self, spider):
        for exporter in self.year_to_exporter.values():
            exporter.finish_exporting()

    def _exporter_for_item(self, item):
        adapter = ItemAdapter(item)
        cat = adapter['image_category']
        if cat not in self.category:
            f = open(f'{cat}.csv', 'wb')
            exporter = CsvItemExporter(f)
            exporter.start_exporting()
            self.category[cat] = exporter
        return self.category[cat]

    def process_item(self, item, spider):
        exporter = self._exporter_for_item(item)
        exporter.export_item(item)
        return item