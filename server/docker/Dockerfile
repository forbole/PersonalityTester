FROM huggingface/transformers-pytorch-cpu

# Prepare work directory.
RUN mkdir /predict
WORKDIR /predict

# Add the ML model. The `model.h5` file we need is inside a zip.

# Add our python script.
COPY compute.py .