# Streaming Service ML-React-App

With so many streaming platforms available today, how do you pick which one to subscribe to?

This is a web application with a React frontend and Flask backend that predicts what streaming service (out of Netflix, Hulu, Prime Video, or Disney+) a user should get, based on the user's responses to a form asking about the kinds of movies they'd like to watch.

I used a supervised learning model trained on features such as release year, runtime, minimum age, country, language, and genre to predict which platform a movie with those attributes would most likely be found on. I decided to go with Multinomial Logistic Regression since the multinomial part is for classifying data into multiple classes (not just two different classes). Furthermore, in my exploration, I experimented with a Multinomial Logistic Regression classifier, Decision Tree classifiers, Support Vector Machine classifiers, and K Neighbors classifiers, and the Multinomial Logistic Regression classifier had the highest accuracy for the validation set.

## Technologies Used

React, JavaScript, CSS, React Bootstrap, Flask, Python, Python's sklearn library

## Acknowledgements

Thanks to this helpful guide on a ML React and Flask app template: https://towardsdatascience.com/create-a-complete-machine-learning-web-application-using-react-and-flask-859340bddb33

Also, thank you to this Kaggle dataset of Netflix, Hulu, Prime Video, and Disney+ movies that I trained my ML model on: https://www.kaggle.com/ruchi798/movies-on-netflix-prime-video-hulu-and-disney
