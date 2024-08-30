document.addEventListener('DOMContentLoaded', () => {
    let selectedHorse = null;
    let betAmount = 0;
    let money = 50000;

    const updateMoneyDisplay = () => {
        document.getElementById('current-money').textContent = money;
    };

    const resetGame = () => {
        money = 10000;
        updateMoneyDisplay();
        selectedHorse = null;
        betAmount = 0;
        document.querySelector('.horse-selection').style.display = 'block';
        document.querySelector('.race-track').style.display = 'none';
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('result').style.display = 'none';
        document.getElementById('bet-amount').value = 1;
    };

    document.querySelectorAll('.select-button').forEach(button => {
        button.addEventListener('click', () => {
            selectedHorse = button.dataset.horse;
            betAmount = parseInt(document.getElementById('bet-amount').value, 10);

            if (isNaN(betAmount) || betAmount <= 0 || betAmount > money) {
                alert('유효한 금액을 입력하세요.');
                return;
            }

            money -= betAmount;
            updateMoneyDisplay();

            document.querySelector('.horse-selection').style.display = 'none';
            document.querySelector('.race-track').style.display = 'block';
            document.getElementById('startButton').style.display = 'block';
            document.getElementById('result').style.display = 'none'; // 결과 숨기기
        });
    });

    document.getElementById('startButton').addEventListener('click', function() {
        if (!selectedHorse) {
            alert('먼저 말을 선택하세요!');
            return;
        }

        const horses = Array.from(document.querySelectorAll('.horse'));
        const trackWidth = document.querySelector('.race-track').offsetWidth;
        const horsePositions = {};

        // 각 말의 속도를 무작위로 설정
        horses.forEach(horse => {
            const randomSpeed = Math.floor(Math.random() * 10) + 5; // 5에서 15 사이의 속도
            horse.dataset.speed = randomSpeed;
            horse.style.left = '0px';
            horsePositions[horse.id] = 0; // 위치 초기화
        });

        // 각 말의 이동을 제어할 변수
        let raceEnded = false;

        // 경주를 시작합니다.
        const raceInterval = setInterval(() => {
            if (raceEnded) return; // 경주가 끝났다면 이동하지 않음

            let positions = [];

            horses.forEach(horse => {
                const currentLeft = parseInt(horse.style.left, 10);
                const speed = parseInt(horse.dataset.speed, 10); // 각 말의 속도를 가져옴
                const newLeft = currentLeft + speed;

                horse.style.left = newLeft + 'px';
                horsePositions[horse.id] = newLeft;

                // 말의 현재 위치를 기록합니다.
                positions.push({ id: horse.id, left: newLeft });

                // 말이 트랙 끝에 도달했는지 확인
                if (newLeft >= (trackWidth - horse.offsetWidth)) {
                    clearInterval(raceInterval);
                    raceEnded = true;

                    // 위치를 기준으로 순위를 정렬합니다.
                    positions.sort((a, b) => b.left - a.left);

                    // 결과를 작성합니다.
                    let resultText = '경주 결과:\n';
                    positions.forEach((horse, index) => {
                        const place = index + 1;
                        resultText += `${place}등: ${horse.id}\n`;
                    });

                    // 선택한 말의 결과를 포함하여 출력합니다.
                    const selectedHorsePosition = positions.findIndex(horse => horse.id === selectedHorse) + 1;
                    let winnings = 0;
                    if (selectedHorsePosition === 1) {
                        winnings = betAmount * 5;
                    } else if (selectedHorsePosition === 2) {
                        winnings = betAmount * 3;
                    } else if (selectedHorsePosition === 3) {
                        winnings = betAmount * 2;
                    }

                    // 자산 업데이트
                    money += winnings;
                    updateMoneyDisplay();

                    resultText += `\n선택한 ${selectedHorse}는 ${selectedHorsePosition}등입니다.`;
                    if (winnings > 0) {
                        resultText += `\n축하합니다! ${winnings}원을 획득했습니다.`;
                    } else {
                        resultText += `\n아쉽습니다. 이기지 못했습니다.`;
                    }

                    document.getElementById('result').textContent = resultText;
                    document.getElementById('result').style.display = 'block';

                    if (money <= 0) {
                        document.getElementById('result').textContent += '\n자산이 소진되었습니다. 게임을 다시 시작합니다.';
                        setTimeout(resetGame, 3000); // 3초 후에 게임을 초기화
                    } else {
                        document.querySelector('.horse-selection').style.display = 'block';
                        document.querySelector('.race-track').style.display = 'none';
                        document.getElementById('startButton').style.display = 'none';
                    }
                }
            });
        }, 100);
    });
});
