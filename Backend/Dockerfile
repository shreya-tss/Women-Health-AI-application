# Use an official Python runtime as a parent image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt first (to ensure dependency caching)
COPY requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app files
COPY . /app

# Expose port 5000 for Flask API
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app.py

# Run the Flask server
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
