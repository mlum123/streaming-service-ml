# classifier that uses supervised learning to predict whether a movie / show can be found on Netflix, Hulu, Prime Video, or Disney+
import numpy as np
import pandas as pd
import itertools
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.externals import joblib

### Load Data from CSV ###
df = pd.read_csv("MoviesOnStreamingPlatforms_updated.csv")

### Drop Rows Where Content is on Multiple Platforms ###
platforms = ['Netflix', 'Hulu', 'Prime Video', 'Disney+']
for pair in list(itertools.combinations(platforms, 2)):
    index_names = df[ (df[pair[0]] == 1) & (df[pair[1]] == 1)].index
    df.drop(index_names, inplace=True)

### Select Features for Use in Model ###
features = ['Year', 'Runtime', 'Age', 'Genres', 'Country', 'Language']

### Drop Rows with NaN for Any of the Selected Features ###
df.dropna(subset=features, inplace=True)

### Find Labels ###
# add platform as a column
# 0 for Netflix, 1 for Hulu, 2 for Prime Video, 3 for Disney+
def label_platform(row):
    if row['Netflix'] == 1:
        return 0
    if row['Hulu'] == 1:
        return 1
    if row['Prime Video'] == 1:
        return 2
    if row['Disney+'] == 1:
        return 3
df['platform'] = df.apply(lambda row: label_platform(row), axis=1)
labels = df['platform']

### Convert Columns into Numerical Data ###
# create min_age column from Age column
def min_age(row):
    if row['Age'] == 'all':
        return 0
    if row['Age'] == '7+':
        return 7
    if row['Age'] == '13+':
        return 13
    if row['Age'] == '16+':
        return 16
    if row['Age'] == '18+':
        return 18
df['min_age'] = df.apply(lambda row: min_age(row), axis=1)

# add each specific genre, country, and language as its own column (ex: Drama, United States, or English)
# in those columns, 1 indicates that it falls under that genre, country, or language
# 0 means it doesn't
def set_col(row, new_col, old_col):
    if new_col in row[old_col]:
        return 1
    return 0

new_cols = []
for col in ['Genres', 'Country', 'Language']:
    all_cols_str = df[col].tolist()
    all_cols_arr = [line.split(',') for line in all_cols_str]
    for list in all_cols_arr:
        for new_col in list:
            if new_col not in df.columns and new_col not in new_cols:
                new_cols.append(new_col)
                df[new_col] = df.apply(lambda row: set_col(row, new_col, col), axis=1)

### Select Final Features for Use in Model ###
features_final = ['Year', 'Runtime', 'min_age']
features_final += new_cols
features_final_df = df[features_final]

### Split into Training and Validation Sets ###
X_train, X_test, y_train, y_test = train_test_split(features_final_df, labels, test_size=0.2)

### Normalize Features ###
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

### Logistic Regression Model ###
# create Logistic Regression model to split data into 4 classes of platforms
# predict which platform the user will get the most out of, based on their preferences for the movies they want to watch
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(multi_class='multinomial', solver='lbfgs')
model.fit(X_train, y_train)

### Save the Model to Disk ###
joblib.dump(model, 'classifier.joblib')