
from flask import Blueprint, request, current_app, jsonify

example = Blueprint(name="example", import_name=__name__)
@example.route('', methods=['GET', 'DELETE'])
def _example():
    # print("current_app=%s" % current_app)
    return "Example"
