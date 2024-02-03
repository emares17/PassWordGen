const slider = document.getElementById('slider');
const amount = document.getElementById('amount');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const generate = document.getElementById('generate');
const passwordResult = document.getElementById('password-result');

// Slider event listener & styles
const sliderValue = slider.value;
const initialProgress = (slider.value / slider.max) * 100;
slider.style.background = `linear-gradient(to right, hsl(127, 100%, 82%) ${initialProgress}%, hsl(248, 15%, 11%) ${initialProgress}%)`;

amount.textContent = `${slider.value}`;

slider.addEventListener("input", (event) => {
  const tempSliderValue = event.target.value; 
  amount.textContent = `${tempSliderValue}`;
    
  const progress = (tempSliderValue / slider.max) * 100;
   
  slider.style.background = `linear-gradient(to right, hsl(127, 100%, 82%) ${progress}%, hsl(248, 15%, 11%) ${progress}%)`;
});

  // Password generator options
const passwordIncludes = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "1234567890",
  symbols: "!@#$%&'()*+,^-./:;<=>?[]_`{~}|"
};

//Event Listener to generate password with user selected options 
generate.addEventListener('click', () => {
  const sliderValue = slider.value;
  const result = generatePassword(sliderValue);

  passwordResult.innerHTML = result;
});

// Function to gather letters, numbers, and symbols that were checked by the user. 
const selectedOptions = () => {
  const selectedOptions = [];

  const checkboxes = document.querySelectorAll('.checkbox');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const option = checkbox.id;
      selectedOptions.push(...passwordIncludes[option])
    };
  });

  return selectedOptions;
};

const generatePassword = (sliderValue) => {
  // Array of user selected characters
  const passwordIncludes = selectedOptions();

  // shuffle array of password characters using Fisher-Yates algorithm
  for (let i = passwordIncludes.length - 1; i > 0; i--) {
    const swapIndex = randRange(i + 1);
    const temp = passwordIncludes[i];
    passwordIncludes[i] = passwordIncludes[swapIndex];
    passwordIncludes[swapIndex] = temp;
  };

  // Truncate the shuffled array down to the user selected length
  const truncatePassword = passwordIncludes.slice(0, sliderValue);

  return truncatePassword.join('');
};

// Generate a random integer r with equal chance in  min <= r < max.
const randRange = (max) => {
  const requestBytes = Math.ceil(Math.log2(max) / 8);
  
  if (!requestBytes) {
    return 0;
  }

  const maxNum = Math.pow(256, requestBytes);
  const ar = new Uint8Array(requestBytes);

  while (true) {
    window.crypto.getRandomValues(ar);

    let val = 0;
    for (let i = 0; i < requestBytes; i++) {
      val = (val << 8) + ar[i];
    };

    if (val < maxNum - maxNum % max) {
      return val % max;
    };
  };
};

// Copy button transform function when clicked 
document.getElementById('copy').addEventListener('click', () => {
  const password = passwordResult.textContent;
  navigator.clipboard.writeText(password);
});
