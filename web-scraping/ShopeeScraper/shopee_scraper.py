import requests
import json
import shutil
import pathlib
import os

def get_shopee_image_list(keyword):

    pathlib.Path('shopee_image/'+ keyword.replace(" ", "_")).mkdir(parents=True, exist_ok=True)

    batchs = [
        {
            "page": 2,
            'if-none-match-': '55b03-47989622a595ed55295e2ea170e303fa',
            'referer': 'https://shopee.co.th/search?keyword=pet%20food&page=1',
            'cookie': 'SPC_IA=-1; SPC_F=Cs90hB19ejGy1vkGzxFZEOpEIT9YoLXH; REC_T_ID=1068d076-dfc4-11ea-8448-60f18a3026dd; _fbp=fb.2.1597584377228.378053763; language=th; _gcl_au=1.1.837588212.1608010882; SC_DFP=L3EW9gNHY15vgXoWjWKTDBTgvZIds9al; _med=refer; SPC_EC=-; SPC_U=-; csrftoken=lGPvCVGpuv2JUXdc0XGEPCprLK7Ryfq6; SPC_SI=mall.arzziRNJR0sBZNM59B5NiStLvi5LJXw9; welcomePkgShown=true; AMP_TOKEN=%24NOT_FOUND; _gid=GA1.3.1362970835.1613902727; _ga_L4QXS6R7YG=GS1.1.1613902726.24.1.1613903106.60; SPC_CT_a62ed8f8="1613903105.ieTt4Shmxgqs+Qy9vXtMaPC8WNAHIdCIATB7UcPCt0klX5SrOD9oWvIky/4Pt+wa"; _ga=GA1.3.2106351976.1597584382; SPC_R_T_ID="K/v5VDhAMGXusHYjkXSdctfFhnZ10gk9O1z9w/ImChM4Mewt3VEXmi8twuHNm7do/NvMhTbjsdAHVKJuKt9pBtayfTNMjpfC7LZfNiVGh3A="; SPC_T_IV="dnHBPOKqjxc+kqd6SJRR0g=="; SPC_R_T_IV="dnHBPOKqjxc+kqd6SJRR0g=="; SPC_T_ID="K/v5VDhAMGXusHYjkXSdctfFhnZ10gk9O1z9w/ImChM4Mewt3VEXmi8twuHNm7do/NvMhTbjsdAHVKJuKt9pBtayfTNMjpfC7LZfNiVGh3A="',
        },
        #
        # {
        #     "page": 9,
        #     'if-none-match-': '55b03-21d37c50ee6fd039adbb940a66e65e3b',
        #     'referer': 'https://shopee.co.th/search?keyword=gun%20toy&page=8',
        #     'cookie': 'SPC_IA=-1; SPC_F=Cs90hB19ejGy1vkGzxFZEOpEIT9YoLXH; REC_T_ID=1068d076-dfc4-11ea-8448-60f18a3026dd; _fbp=fb.2.1597584377228.378053763; language=th; _gcl_au=1.1.837588212.1608010882; SC_DFP=L3EW9gNHY15vgXoWjWKTDBTgvZIds9al; _med=refer; SPC_EC=-; SPC_U=-; SPC_SI=mall.oK6yfIYyNIWUObaj21fJe1UA5AL3NKnp; _gid=GA1.3.2063443123.1613468712; csrftoken=Kh9mOnP1JMKILalKmWbKTnDIrumYMRK8; welcomePkgShown=true; AMP_TOKEN=%24NOT_FOUND; SPC_CT_5f754666=1613498239.jgbHDiz9xooFEGMMMbNDxBcVmeIEUt0K5HaQ8W9leOV26JqmGo79cdez+qoylw0P; _ga_L4QXS6R7YG=GS1.1.1613497359.23.1.1613498241.0; _ga=GA1.3.2106351976.1597584382; SPC_R_T_ID="0ukuhZCv7/wfBAOrW6mctXz+tUQmuM5EiNixfEB/5kkUsMfSWhvCET2CxISyajOg/DIQHu31CoZN2VBsmYJAxNDOFKizJ3/ZtNAl1rZHcYs="; SPC_T_IV="D1ABs++oxW66kG35VXHGQQ=="; SPC_R_T_IV="D1ABs++oxW66kG35VXHGQQ=="; SPC_T_ID="0ukuhZCv7/wfBAOrW6mctXz+tUQmuM5EiNixfEB/5kkUsMfSWhvCET2CxISyajOg/DIQHu31CoZN2VBsmYJAxNDOFKizJ3/ZtNAl1rZHcYs="',
        # },
        #
        # {
        #     "page": 10,
        #     'if-none-match-': '55b03-56fed0fb978716aa276ac3021f6ecae5',
        #     'referer': 'https://shopee.co.th/search?keyword=gun%20toy&page=9',
        #     'cookie': 'SPC_IA=-1; SPC_F=Cs90hB19ejGy1vkGzxFZEOpEIT9YoLXH; REC_T_ID=1068d076-dfc4-11ea-8448-60f18a3026dd; _fbp=fb.2.1597584377228.378053763; language=th; _gcl_au=1.1.837588212.1608010882; SC_DFP=L3EW9gNHY15vgXoWjWKTDBTgvZIds9al; _med=refer; SPC_EC=-; SPC_U=-; SPC_SI=mall.oK6yfIYyNIWUObaj21fJe1UA5AL3NKnp; _gid=GA1.3.2063443123.1613468712; csrftoken=Kh9mOnP1JMKILalKmWbKTnDIrumYMRK8; welcomePkgShown=true; AMP_TOKEN=%24NOT_FOUND; _ga_L4QXS6R7YG=GS1.1.1613497359.23.1.1613498306.0; _ga=GA1.1.2106351976.1597584382; _dc_gtm_UA-61914165-6=1; SPC_CT_5f754666="1613498306.n6xMyNDvgcQuYy1UEb02Oq1k/rScqL7Un4Kx3de4YYTCR0R6yxjMPDLhILPpP6mp"; SPC_R_T_ID="G2sqAIt1utZUh74RnBOXL/R3O2+y81ImYVQANIArVsCrASWneWsSGXwubsSQ567jDmTNKgeSMPrsJEEXMj4OavcjcUY/d6HQw4Cacz9riDM="; SPC_T_IV="lVbjAMMbdXwPLJXnTJb5Ew=="; SPC_R_T_IV="lVbjAMMbdXwPLJXnTJb5Ew=="; SPC_T_ID="G2sqAIt1utZUh74RnBOXL/R3O2+y81ImYVQANIArVsCrASWneWsSGXwubsSQ567jDmTNKgeSMPrsJEEXMj4OavcjcUY/d6HQw4Cacz9riDM="',
        # },
        #
        # {
        #     "page": 11,
        #     'if-none-match-': '55b03-f8fed6c5ba977d3a03a7c98e490cbd5e',
        #     'referer': 'https://shopee.co.th/search?keyword=gun%20toy&page=10',
        #     'cookie': 'SPC_IA=-1; SPC_F=Cs90hB19ejGy1vkGzxFZEOpEIT9YoLXH; REC_T_ID=1068d076-dfc4-11ea-8448-60f18a3026dd; _fbp=fb.2.1597584377228.378053763; language=th; _gcl_au=1.1.837588212.1608010882; SC_DFP=L3EW9gNHY15vgXoWjWKTDBTgvZIds9al; _med=refer; SPC_EC=-; SPC_U=-; SPC_SI=mall.oK6yfIYyNIWUObaj21fJe1UA5AL3NKnp; _gid=GA1.3.2063443123.1613468712; csrftoken=Kh9mOnP1JMKILalKmWbKTnDIrumYMRK8; welcomePkgShown=true; AMP_TOKEN=%24NOT_FOUND; SPC_CT_5f754666=1613498344.qX4ZxwvhFh5DqGU0fKHHM+UH549zSL0BrEPZ0z5T7KlojRK0EEV04wOGkv1sIN4F; _ga_L4QXS6R7YG=GS1.1.1613497359.23.1.1613498345.0; _ga=GA1.3.2106351976.1597584382; SPC_R_T_ID="tzpP/R8Umxwc+RSZaOxVQySOZHz+xuECXQNvEovfWadVlt7X6I6MNCW3AeHR3TVPdTwXT7bagPnKtwZfxb/PcG83dAy+zMfYW+fh/Y61HRk="; SPC_T_IV="67bV+qgol3e6QuMUNYhx7w=="; SPC_R_T_IV="67bV+qgol3e6QuMUNYhx7w=="; SPC_T_ID="tzpP/R8Umxwc+RSZaOxVQySOZHz+xuECXQNvEovfWadVlt7X6I6MNCW3AeHR3TVPdTwXT7bagPnKtwZfxb/PcG83dAy+zMfYW+fh/Y61HRk="',
        # },
        #
        # {
        #     "page": 12,
        #     'if-none-match-': '55b03-ad475d58ac6bd5b96537b689f04f8cba',
        #     'referer': 'https://shopee.co.th/search?keyword=gun%20toy&page=11',
        #     'cookie': 'SPC_IA=-1; SPC_F=Cs90hB19ejGy1vkGzxFZEOpEIT9YoLXH; REC_T_ID=1068d076-dfc4-11ea-8448-60f18a3026dd; _fbp=fb.2.1597584377228.378053763; language=th; _gcl_au=1.1.837588212.1608010882; SC_DFP=L3EW9gNHY15vgXoWjWKTDBTgvZIds9al; _med=refer; SPC_EC=-; SPC_U=-; SPC_SI=mall.oK6yfIYyNIWUObaj21fJe1UA5AL3NKnp; _gid=GA1.3.2063443123.1613468712; csrftoken=Kh9mOnP1JMKILalKmWbKTnDIrumYMRK8; welcomePkgShown=true; AMP_TOKEN=%24NOT_FOUND; SPC_CT_5f754666="1613498381.hdoIGR/5srrCilGuqCUl54WvLsWiv/lMCkdKZPmT48Q/NrAIJfKNg8V8cXIygg71"; _ga_L4QXS6R7YG=GS1.1.1613497359.23.1.1613498382.0; _ga=GA1.3.2106351976.1597584382; SPC_R_T_ID="gw5UrTxho5JKDIl97nOVUmFa8eiahykbv1dWr7uoPXQBuDqoH3Og1hkkIIoiSHtVI/x/f9KioHLp4/t63LHwQporfttSZU+NFCmgn/oKhHQ="; SPC_T_IV="imG37DGyBGlejKWw1/3bIg=="; SPC_R_T_IV="imG37DGyBGlejKWw1/3bIg=="; SPC_T_ID="gw5UrTxho5JKDIl97nOVUmFa8eiahykbv1dWr7uoPXQBuDqoH3Og1hkkIIoiSHtVI/x/f9KioHLp4/t63LHwQporfttSZU+NFCmgn/oKhHQ="',
        # },
        #
        # {
        #     "page": 13,
        #     'if-none-match-': '55b03-8f2597062b3c6314c4d81a77e38129b0',
        #     'referer': 'https://shopee.co.th/search?keyword=gun%20toy&page=12',
        #     'cookie': 'SPC_IA=-1; SPC_F=Cs90hB19ejGy1vkGzxFZEOpEIT9YoLXH; REC_T_ID=1068d076-dfc4-11ea-8448-60f18a3026dd; _fbp=fb.2.1597584377228.378053763; language=th; _gcl_au=1.1.837588212.1608010882; SC_DFP=L3EW9gNHY15vgXoWjWKTDBTgvZIds9al; _med=refer; SPC_EC=-; SPC_U=-; SPC_SI=mall.oK6yfIYyNIWUObaj21fJe1UA5AL3NKnp; _gid=GA1.3.2063443123.1613468712; csrftoken=Kh9mOnP1JMKILalKmWbKTnDIrumYMRK8; welcomePkgShown=true; AMP_TOKEN=%24NOT_FOUND; SPC_CT_5f754666="1613498446.1qq9YRuYnQLSh8Cq4nJNWPaf/Hj3NlOeMLtxAKVyl7zrFYDsbSQv9XhDcuDaoS0p"; _ga_L4QXS6R7YG=GS1.1.1613497359.23.1.1613498447.0; _ga=GA1.3.2106351976.1597584382; _dc_gtm_UA-61914165-6=1; SPC_R_T_ID="jWP5ikmqbVV9AkmDw6QQ37xBAJ++ODdPrCYu/MZyua0HDQio3Aeo3mGTN1CVnkcE5XaFRLX31pTct5Plr8BIalwXt0N4nhi+pX6vkisEokA="; SPC_T_IV="6ftM4tqOenFfoU4tpPHDqw=="; SPC_R_T_IV="6ftM4tqOenFfoU4tpPHDqw=="; SPC_T_ID="jWP5ikmqbVV9AkmDw6QQ37xBAJ++ODdPrCYu/MZyua0HDQio3Aeo3mGTN1CVnkcE5XaFRLX31pTct5Plr8BIalwXt0N4nhi+pX6vkisEokA="',
        # },
        #
        # {
        #     "page": 14,
        #     'if-none-match-': '55b03-cf16a0adacafe4a76f32d6a9f5a21aa3',
        #     'referer': 'https://shopee.co.th/search?keyword=gun%20toy&page=13',
        #     'cookie': 'SPC_IA=-1; SPC_F=Cs90hB19ejGy1vkGzxFZEOpEIT9YoLXH; REC_T_ID=1068d076-dfc4-11ea-8448-60f18a3026dd; _fbp=fb.2.1597584377228.378053763; language=th; _gcl_au=1.1.837588212.1608010882; SC_DFP=L3EW9gNHY15vgXoWjWKTDBTgvZIds9al; _med=refer; SPC_EC=-; SPC_U=-; SPC_SI=mall.oK6yfIYyNIWUObaj21fJe1UA5AL3NKnp; _gid=GA1.3.2063443123.1613468712; csrftoken=Kh9mOnP1JMKILalKmWbKTnDIrumYMRK8; welcomePkgShown=true; AMP_TOKEN=%24NOT_FOUND; _ga_L4QXS6R7YG=GS1.1.1613497359.23.1.1613498484.0; SPC_CT_5f754666="1613498483.+taAiZotI4C+lD+8/lrOCkzTuIJZvYq/FDU8vJjTMvSyhK4zXza8k7EyW001J27S"; _ga=GA1.3.2106351976.1597584382; SPC_R_T_ID="4KW8TEQNBE3UYXYhu/enPdinruG/7bu2w2R85YEMybvx3XyV9jLzh4rs4Br4R+GWVqMCwlhlr6ysPEhAWammNAaFrqUWJFBK80VMj+mPo6I="; SPC_T_IV="bouvmtbjumAPevQ2VWgWOA=="; SPC_R_T_IV="bouvmtbjumAPevQ2VWgWOA=="; SPC_T_ID="4KW8TEQNBE3UYXYhu/enPdinruG/7bu2w2R85YEMybvx3XyV9jLzh4rs4Br4R+GWVqMCwlhlr6ysPEhAWammNAaFrqUWJFBK80VMj+mPo6I="',
        # },
        #
        # {
        #     "page": 15,
        #     'if-none-match-': '55b03-d4f5517958eb68cbf5f6cd71494d9caf',
        #     'referer': 'https://shopee.co.th/search?keyword=gun%20toy&page=14',
        #     'cookie': 'SPC_IA=-1; SPC_F=Cs90hB19ejGy1vkGzxFZEOpEIT9YoLXH; REC_T_ID=1068d076-dfc4-11ea-8448-60f18a3026dd; _fbp=fb.2.1597584377228.378053763; language=th; _gcl_au=1.1.837588212.1608010882; SC_DFP=L3EW9gNHY15vgXoWjWKTDBTgvZIds9al; _med=refer; SPC_EC=-; SPC_U=-; SPC_SI=mall.oK6yfIYyNIWUObaj21fJe1UA5AL3NKnp; _gid=GA1.3.2063443123.1613468712; csrftoken=Kh9mOnP1JMKILalKmWbKTnDIrumYMRK8; welcomePkgShown=true; AMP_TOKEN=%24NOT_FOUND; SPC_CT_5f754666="1613498518.yEuf/J4/it/PN9QKInaUNvuIKOlfRC/G3xshS5qPLBulB0EfvntlQBn6iRuw+Wg8"; _ga_L4QXS6R7YG=GS1.1.1613497359.23.1.1613498519.0; _ga=GA1.3.2106351976.1597584382; _dc_gtm_UA-61914165-6=1; SPC_R_T_ID="8ivdBgWUxgFWzTF36nmNNlgWbNV+/APUKJLItYv9qv4tMLYiVvFe1TQr9ic61CN9uY9tjiFca1bmXEQCivls24OfxVjvgsvA3VyPhZCzF2k="; SPC_T_IV="GK5Bdxwjdm9jauL29XQ3cg=="; SPC_R_T_IV="GK5Bdxwjdm9jauL29XQ3cg=="; SPC_T_ID="8ivdBgWUxgFWzTF36nmNNlgWbNV+/APUKJLItYv9qv4tMLYiVvFe1TQr9ic61CN9uY9tjiFca1bmXEQCivls24OfxVjvgsvA3VyPhZCzF2k="',
        # },
    ]

    newest=0
    page=0

    for batch in batchs:

        headers = {
            'authority': 'shopee.co.th',
            'x-shopee-language': 'th',
            'x-requested-with': 'XMLHttpRequest',
            'if-none-match-': batch['if-none-match-'],
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'x-api-source': 'pc',
            'accept': '*/*',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': batch['referer'],
            'accept-language': 'en-US,en;q=0.9',
            'cookie': batch['cookie'],
        }

        params = {
            'by': 'relevancy',
            'keyword': 'pet food',
            'limit': '50',
            'newest': str(newest),
            'order': 'desc',
            'page_type': 'search',
            'version': '2',
        }

        response = requests.get('https://shopee.co.th/api/v2/search_items/', headers=headers, params=params)

        # print(response.json())
        response = json.loads(response.text)

        # need_next_search = response['need_next_search']

        items = response['items']

        for item in items:
            path = pathlib.Path() / 'shopee_image'/ keyword.replace(" ", "_") / f'img_{item["image"]}.jpeg'
            if path.exists():
                print("File already exists")
                continue
            else:
                r = requests.get(f'https://cf.shopee.co.th/file/{item["image"]}', stream=True)
                if r.status_code == 200:
                    with open(path, 'wb') as f:
                        r.raw.decode_content = True
                        shutil.copyfileobj(r.raw, f)

        newest+=50
        page+=1

if __name__ == "__main__":
    get_shopee_image_list('gun toy 2')