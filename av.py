from PIL import Image
import numpy as np

image = Image.open('damn.jpg')
np_image = np.array(image)
if np_image.shape[2] == 4:
    np_image = np_image[:, :, :3]
average_color = np.mean(np_image, axis=(0, 1))
average_color = tuple(average_color.astype(int))
print(f"average color: {average_color}")