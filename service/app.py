from flask import Flask, request, jsonify, make_response
from flask_restplus import Api, Resource, fields
from sklearn.externals import joblib

flask_app = Flask(__name__)
app = Api(app = flask_app, 
		  version = "1.0", 
		  title = "ML React App", 
		  description = "Predict results using a trained model")

name_space = app.namespace('prediction', description='Prediction APIs')

model = app.model('Prediction params', 
				  {'country': fields.String(required = True, 
				  							description="Country", 
    					  				 	help="Country cannot be blank"),
				  'language': fields.String(required = True, 
				  							description="Language", 
    					  				 	help="Language cannot be blank"),
				  'genres': fields.Array(required = True, 
				  							description="Genre(s)", 
    					  				 	help="Must pick at least one Genre"),
				  'releaseyear': fields.String(required = True, 
				  							   description="Release Year", 
    					  				 	   help="Release Year cannot be blank"),
				  'runtime': fields.String(required = True, 
				  							   description="Runtime in minutes", 
    					  				 	   help="Runtime cannot be blank"),
				  'minage': fields.String(required = True, 
				  							description="Minimum Age to see movie", 
    					  				 	help="Min Age cannot be blank")})

# classifier = joblib.load('classifier.joblib')

@name_space.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	@app.expect(model)		
	def post(self):
		try: 
			formData = request.json
			data = [val for val in formData.values()]
			# prediction = classifier.predict(data)
			response = jsonify({
				"statusCode": 200,
				"status": "Choice made",
				"result": "Choice: " + str(data)
				})
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make choice",
				"error": str(error)
			})