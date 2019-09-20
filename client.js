const Client = class {

    constructor(auth_token, domain, port = 443) {
        this._domain = domain;
        this._port = port;
        this._auth = auth_token;
        this._callback = (question_id, answer) => {
        };
    }

    check_question(course, question_id, page_url) {
        $.post(`https://${this._domain}:${this._port}/check_question`, {
            'c_id': course,
            'q_id': question_id,
            'url': page_url,
            'sign': this._auth,
        }, (reply) => {
            this._callback(question_id, reply);
        });
    }

    set_callback(callback) {
        this._callback = callback;
    }
};

const DOMAIN = 'kupihleba.xyz';
const STORAGE_TAG = 'answers';
// This service key would work only during development
const SECRET_TOKEN = '\\M62)eRAq*4CZkYRJc8K6\\XmaVTC#N(4';
const client = new Client(SECRET_TOKEN, DOMAIN);
client.set_callback(answer_received);

function init() {
    const page = window.location.href;
    if (page.match(/\/courses\/(.*)\/courseware\//) !== null) {
        console.log('= TEST DETECTED =');
        const course = page.match(/\/courses\/(.*)\/courseware\//)[1];
        get_answers(course, page);
    }
}

init();


function get_tasks() {
    return $('.problem-header').map((i, item) => {
        return item.id.split('-')[0];
    });
}

console.log('tasks:', get_tasks());

function store_answer(question_id, answer) {
    let answers = localStorage.getItem(STORAGE_TAG);
    if (answers) {
        answers = JSON.parse(answers);
        answers[question_id] = answer;
        localStorage.setItem(STORAGE_TAG, JSON.stringify(answers));
    } else {
        const dict = {};
        dict[question_id] = answer;
        localStorage.setItem(STORAGE_TAG, JSON.stringify(dict));
    }
}

function answer_received(question_id, answer) {
    console.log(question_id, answer);
    store_answer(question_id, answer);
    highlight_answer(question_id, answer);
}

function highlight_answer(question_id, answer) {
    $(`#${question_id}_2_1-choice_${answer}-label`).addClass('correct_highlight');
}

function get_answers(course, page) {
    const answers = localStorage.getItem(STORAGE_TAG);
    if (answers) {
        const dict = JSON.parse(answers);
        get_tasks().each((_, question_id) => {
            console.log('loop', question_id);
            if (!(question_id in dict)) {
                client.check_question(course, question_id, page);
            }
        });
        Object.keys(dict).forEach(key => {
            console.log(key, dict[key]);
            highlight_answer(key, dict[key]);
        })
    } else {
        get_tasks().each((_, question_id) => {
            client.check_question(course, question_id, page);
        });
    }
}

