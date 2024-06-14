const fileInput = document.querySelector(".fileInput");
const chooseImage = document.querySelector(".choose-img");
const previewImage = document.querySelector("#previewSection img");
const filterOptions = document.querySelectorAll("#btns button");
const refFilterName = document.querySelector("#slider .fname");
const refFilterValue = document.querySelector("#slider .fvalue");
const inputField = document.querySelector("#slider input");
const rotateBtns = document.querySelectorAll("#rotate button");
const reset = document.querySelector(".resetf");
const saveImg = document.querySelector(".save-img");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  grayscale = 0,
  rotate = 0,
  flipHor = 1,
  flipVer = 1;

// function to an select image
function selectImage() {
  // function to click on fileInput using the chooseImage button
  chooseImage.addEventListener("click", () => {
    fileInput.click();
  });

  //function to load an image
  const loadImage = () => {
    let file = fileInput.files[0]; // getting user selected file
    if (!file) return;
    previewImage.src = URL.createObjectURL(file); // create a url of passed file object
    previewImage.addEventListener("load", () => {
      reset.click();
      document.querySelector("#main").classList.remove("disable");
    });
  };
  fileInput.addEventListener("change", loadImage);
}

//function to apply filters on the image
const applyFilter = () => {
  previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  previewImage.style.transform = `rotate(${rotate}deg) scaleX(${flipHor}) scaleY(${flipVer})`;
  console.log(
    `Filters applied: brightness(${brightness}%), saturate(${saturation}%), invert(${inversion}%), grayscale(${grayscale}%)`
  );
};

// function to select the filter and update their name in editSection
function selectFilter() {
  filterOptions.forEach((filter) => {
    filter.addEventListener("click", () => {
      document.querySelector("#btns .active").classList.remove("active");
      filter.classList.add("active");
      refFilterName.textContent = filter.textContent;

      if (filter.id === "brightness") {
        inputField.max = "200";
        inputField.value = brightness;
        refFilterValue.textContent = `${brightness}%`;
      } else if (filter.id === "saturation") {
        inputField.max = "200";
        inputField.value = saturation;
        refFilterValue.textContent = `${saturation}%`;
      } else if (filter.id === "inversion") {
        inputField.max = "100";
        inputField.value = inversion;
        refFilterValue.textContent = `${inversion}%`;
      } else if (filter.id === "grayscale") {
        inputField.max = "100";
        inputField.value = grayscale;
        refFilterValue.textContent = `${grayscale}%`;
      }
    });
  });

  // funtion to get the value of range input field and the reflect it back
  const inputVal = () => {
    refFilterValue.textContent = `${inputField.value}%`;
    const filterBtn = document.querySelector("#btns .active");
    if (filterBtn.id === "brightness") {
      brightness = inputField.value;
    } else if (filterBtn.id === "saturation") {
      saturation = inputField.value;
    } else if (filterBtn.id === "inversion") {
      inversion = inputField.value;
    } else if (filterBtn.id === "grayscale") {
      grayscale = inputField.value;
    }
    applyFilter();
  };

  inputField.addEventListener("input", inputVal);
}

// function to change the prespective of an image
const changePrespective = () => {
  rotateBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.id === "left") {
        rotate -= 90;
      } else if (btn.id === "right") {
        rotate += 90;
      } else if (btn.id === "horizontally") {
        flipHor = flipHor === 1 ? -1 : 1;
      } else {
        flipVer = flipVer === 1 ? -1 : 1;
      }
      applyFilter();
    });
  });
};

// function to reset all the changes
function resetChanges() {
  const resetVal = () => {
    brightness = 100;
    saturation = 100;
    inversion = 0;
    grayscale = 0;
    rotate = 0;
    flipHor = 1;
    flipVer = 1;
    filterOptions[0].click(); //select brightness button by default
    applyFilter(); // function call to reapply changes on image
  };
  reset.addEventListener("click", resetVal);
}

// function to save the image
function saveImage() {
  const canvas = document.createElement("canvas"); // create canvas element
  const ctx = canvas.getContext("2d"); // return a drawing contextt on the canvas
  canvas.width = previewImage.naturalWidth; // setting canvas width to actual image width
  canvas.height = previewImage.naturalHeight;
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(flipHor, flipVer);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.drawImage(
    previewImage,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL(); // passing a tag href  value to canvas data url
  link.click();
}
saveImg.addEventListener("click", saveImage);
// calling all the functions

selectImage();
selectFilter();
changePrespective();
resetChanges();
