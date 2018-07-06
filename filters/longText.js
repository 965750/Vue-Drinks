// text limit

export default (value) => {
    if(window.innerWidth > 1000){
        return value.slice(0, 170) + '...'
    } else if(window.innerWidth > 600) {
        return value.slice(0, 70) + '...'
    } else if(window.innerWidth < 600) {
        return value.slice(0, 100) + '...'
    }
  }