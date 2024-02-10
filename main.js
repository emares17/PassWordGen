const slider = document.getElementById('slider');
const amount = document.getElementById('amount');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const generate = document.getElementById('generate');
const passwordResult = document.getElementById('password-result');
const bars = document.querySelectorAll('.bar');
const currentDifficulty = document.getElementById('current-difficulty');
const checkboxes = document.querySelectorAll('.checkbox');
const buttonLabel = document.getElementById('button-label');
const arrow = document.getElementById('arrow');

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
  includes = selectedOptions()
  const result = generatePassword(sliderValue, includes);
  const strength = zxcvbn(result)

  const checkedCheckboxes = Array.from(checkboxes).every(checkbox => !checkbox.checked);

  if (checkedCheckboxes) {
    setTimeout(() => {
      arrow.style.display = 'none';
      buttonLabel.textContent = 'Please select options'

      setTimeout(() => {
        arrow.style.display = '';
        buttonLabel.textContent = 'GENERATE'
      }, 3000)
    }, 1000);
  } else {
    currentDifficulty.textContent = getStrengthText(strength.score) 
    passwordResult.textContent = result;

    updateBarsColor(strength.score);
  }
});

// Function to gather letters, numbers, and symbols that were checked by the user. 
const selectedOptions = () => {
  const selectedOptions = [];

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const option = checkbox.id;
      selectedOptions.push(...passwordIncludes[option])
    };
  });

  return selectedOptions;
};


const generatePassword = (sliderValue, passwordIncludes) => {

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

// Helper function to get strength text according to its score
const getStrengthText = (score) => {
  if (score === 1) return "WEAK";
  if (score === 2) return "MEDIUM";
  if (score === 3) return "STRONG";
  if (score === 4) return "VERY STRONG";
};


// Helper function to update the color of bars based on the score
const updateBarsColor = (score) => {
  const colors = ['#F00C0C', '#FFD700', '#98FB98', '#00FF7F'];

  bars.forEach((bar, index) => {
    bar.style.backgroundColor = index < score ? colors[score - 1] : '';
  });
};

// RANDOM GENERATORS FOR WINDOW LOAD PASSWORD
// Random number generator between range 5-20
const getRandomIntRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Chooses random checkboxes to add to an options array
const getRandomCheckboxes = () => {
  const selectedOptions = [];

  checkboxes.forEach(checkbox => {
    const randomNumber = Math.floor(Math.random() * 100);

    if (randomNumber % 2 == 0) {
      const option = checkbox.id;
      selectedOptions.push(...passwordIncludes[option])
    };
  });

  return selectedOptions;
}

// generates the random password displayed on window load
const generateRandomPassword = () => {
    const value = getRandomIntRange(5, 20);
    const includes = getRandomCheckboxes()
    result = generatePassword(value, includes)
    const strength = zxcvbn(result)

    passwordResult.textContent = result;
    currentDifficulty.textContent = getStrengthText(strength.score) 

    updateBarsColor(strength.score);
}

// Window load event listener
window.addEventListener('load', generateRandomPassword);