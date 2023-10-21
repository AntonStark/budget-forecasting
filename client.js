function handleSend(e) {
    const input = document.getElementById('numb1')
    const number = Number(input.value)

    console.log(number)
    window.send.sendNumber(number)
}

document.getElementById('send_button').addEventListener('click', handleSend)
