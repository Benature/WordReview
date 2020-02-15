from django.core import serializers
import json


def ormToJson(ormData):
    '''数据转换器'''
    jsonData = serializers.serialize("json", ormData)
    data = json.loads(jsonData)
    return data


def valueList(model, key):
    return [name[0] for name in model.objects.values_list(key)]
