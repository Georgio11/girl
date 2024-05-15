let wrapper = document.querySelector(".wrapper");
        let wheel = document.querySelector('.wheel');
        let btn = document.querySelector('.btn');
        let tries = document.querySelector('.tries');
        let modalContainer = document.querySelector('.modal_container');
        let modal = document.querySelector('.modal');
        let bonus = document.querySelector('.bonus');
        let money = document.querySelector('.money');
        let modalBtn = document.querySelector('.btns button:nth-child(1)');
        let winBtn = document.querySelector('.btns button:nth-child(2)');
        let wheelFrame = document.querySelector('.wheel_container');
        let wheelWidth = wheelFrame.offsetWidth;

        let spinCount = 2;

        function adaptationElements() {
            const aspectRatio = window.innerWidth / window.innerHeight;
            let aspectClass;

            if (aspectRatio >= 2) {
                aspectClass = 'modificate1';
            } else if (aspectRatio >= 1.5) {
                aspectClass = 'modificate2';
            } else if (aspectRatio > 1) {
                aspectClass = 'modificate3';
            } else {
                aspectClass = 'modificate4';
            }

            wrapper.className = `wrapper ${aspectClass}`;
        }

        adaptationElements();
        window.addEventListener('resize', adaptationElements);

        function promiseAfterTimeout(seconds) {
            return new Promise(function (resolve) {
                setTimeout(() => resolve(), seconds * 1000);
            });
        };

        function rotateWheel(degr) {
            wheel.style.transform = 'rotate(' + degr + 'deg)';
            return promiseAfterTimeout(5);
        };

        function launchSpin(degrees) {
            currentRotation += degrees;
            return rotateWheel(currentRotation);
        };

        let spinState = {
            clickedOnce: false,
            count: 0
        };

        let currentRotation = 0;

        let isAnimating = false;

        function setButtonsState(disabled, cursorStyle) {
            btn.disabled = disabled;
            btn.style.cursor = cursorStyle;
        };

        function setClasses() {
            modalContainer.classList.add('active');
            setInterval(()=> {
                modalContainer.classList.add('opacity');
            }, 800)
        }

        btn.addEventListener('click', function() {
            if (!isAnimating && spinState.count < 2) {
                isAnimating = true;
                setButtonsState(true, 'default');

                if (!spinState.clickedOnce) {
                    launchSpin(3200).then(() => {
                        spinState.clickedOnce = true;
                        spinState.count++;
                        setButtonsState(false, 'pointer');
                        isAnimating = false;
                        setClasses();
                    });
                }

                spinCount--;
                tries.innerHTML = spinCount;
            }
        });

        modalBtn.addEventListener('click', ()=> {
            modalContainer.classList.remove('active');
            modalContainer.classList.remove('opacity');
            if (spinCount == 1){
                launchSpin(2700).then(() => {
                    modalContainer.classList.add('active');
                    spinState.count++;
                    setButtonsState(false, 'pointer');
                    isAnimating = false;
                    setClasses();
                    modal.classList.add('active');
                    modalBtn.classList.add('active');
                    winBtn.classList.add('active');
                    bonus.innerHTML = '2200$';
                    bonus.style.color = '#00F0FF'
                });
            } 
            spinCount--;
            tries.innerHTML = spinCount;
        })

        function fall() {
            let randomHeight;
            window.innerWidth <= 1000 ? randomHeight = Math.floor(Math.random() * (100 - 50) + 50) :
            window.innerWidth <= 1300 ? randomHeight = Math.floor(Math.random() * (120 - 60) + 60) :
            randomHeight = Math.floor(Math.random() * (150 - 80) + 80);
    

            const randomZindex = Math.floor(Math.random() * 3);
            const randomPoint = Math.floor(Math.random() * window.innerWidth);
            const randomRotate = Math.floor(Math.random() * 360);
            const randomTransition = Math.random() * (2 - 1) + 3;

            const money = document.createElement('img');
            money.classList.add('money');
            money.setAttribute('src', 'images/coin.webp');
            money.style.cssText = `
                height: ${randomHeight}px;
                transform: translateX(${randomPoint + randomHeight}px) rotate(${randomRotate}deg);
                top: -${randomHeight}px;
                transition: ${randomTransition}s linear;
                z-index: ${randomZindex === 1 ? 1 : 3};`;

            wrapper.appendChild(money);

            setTimeout(() => {
                money.style.transform = `translate(${randomPoint + randomHeight}px, ${window.innerHeight + randomHeight}px) rotate(${randomRotate * 1.3}deg)`;
                setTimeout(() => {
                    const rect = money.getBoundingClientRect();
                    if (rect.bottom > 0) {
                        money.remove();
                    }
                }, randomTransition * 1000);
                fall();
            }, 400);
        }

        fall();