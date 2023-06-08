function learnRoll(before){
    let after = before;
    if(before === 'ungraded'){
        after = 'Grade TK-C';
    }else if(before === 'Grade TK-C'){
        after = 'Grade TK-B';
    }else if (before === 'Grade TK-B'){
        after = 'Grade TK-A';
    }else if (before === 'Grade TK-A'){
        after = 'Grade TK-S';
    }else{
        after += 'S';
    }
    return after
}

module.exports = {learnRoll};