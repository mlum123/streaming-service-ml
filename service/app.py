from flask import Flask, request, jsonify, make_response
from flask_restplus import Api, Resource, fields
from sklearn.externals import joblib
from classifier import features_final_df
from classifier import scaler
import numpy as np

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
				  'genres': fields.String(required = True, 
				  							description="Genres", 
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

classifier = joblib.load('classifier.joblib')

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

			data = []
			for col in features_final_df.columns:
				if col == 'Year':
					data += [int(formData['releaseyear'])]
				elif col == 'Runtime':
					data += [int(formData['runtime'])]
				elif col == 'min_age':
					data += [int(formData['minage'])]
				elif col in formData['genres']:
					data += [1]
				elif col == formData['country']:
					data += [1]
				elif col == formData['language']:
					data += [1]
				else:
					data.append(0)

			# normalize features
			data = scaler.transform(np.array(data).reshape(1, -1))
								
			prediction = classifier.predict(data)
			platforms = {0: "Netflix", 1: "Hulu", 2: "Prime Video", 3: "Disney+"}
			response = jsonify({
				"statusCode": 200,
				"status": "Choice made",
				"result": "Choice: " + platforms[prediction[0]]
				})
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
		except Exception as error:
			response = jsonify({
				"statusCode": 500,
				"status": "Could not make choice",
				"error": str(error)
				})
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response