'use strict';

const lamina_dead_volume = 200;
const wash_dead_volume = 450;
const lamina_btl_volume = 7000 - lamina_dead_volume;
const wash_btl_volume = 7000 - wash_dead_volume;
const lamina_start_day = 175; // 1 cleanser + 2 dil + 1 focus + 2 QC
const lamina_end_day = 105; // 1 cleanser + 2 dil
const lamina_session = 7; // volume for start
const wash_session = 25; // volume for start
const lamina_patient = 14; // volume per sample
const wash_patient = 7.5; // volume per sample
const session_per_day = 2; // average numbers of session per qne day

const e = React.createElement;

class IRIScalculator extends React.Component {

  constructor(props) {
	super(props);
	this.state = {
	  working_days: '',
	  tests_chemistry: '',
	  tests_micro: '',
	  nstripes: '',
	  nwash: '',
	  ncacbcc: '',
	  calcheck: '',
	  ndesiccant: '',
	  nlamina: '',
	  ncontrol_focus: '',
	  ncalibrator: '',
	  ncleanser: '',
	  ndiluent: '',
	  display_result: 'none',
	  display_form: '',
	  only_chem: false,
	  only_micro: false,
	};

	this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	this.handleClick = this.handleClick.bind(this);
  }

    handleChange(event) {
	const target = event.target;
	const name = target.name;
	const value = target.value;
	this.setState({[name]: value});
  }

  handleSubmit(event) {
	event.preventDefault();
	const nstripes = n_stripes_pack(actual_tests_chemistry(this.state.tests_chemistry, this.state.working_days));
	const nwash = n_wash_pack(actual_tests_chemistry(this.state.tests_chemistry, this.state.working_days), this.state.working_days);
	const ncacbcc = 9;
	const calcheck = 5;
	const ndesiccant = n_desiccant_pack(this.state.working_days);
	const nlamina = n_lamina_pack(actual_volume_micro(this.state.tests_micro, this.state.working_days));
	const ncontrol_focus = 12;
	const ncalibrator = 3;
	const ncleanser = 1;
	const ndiluent = 2;
	let only_chem = true;
	let only_micro = true;

	if (Number(this.state.tests_chemistry)) {
	  only_micro = false;
	}
	if (Number(this.state.tests_micro)) {
	  only_chem = false;
	}
	if (!Number(this.state.tests_chemistry) && !Number(this.state.tests_micro)) {
	  alert ('У вас не указано ни количество микроскопий ни количество анализов физико-химических свойств.\rВы вообще собираетесь работать на приборе!?');
	  return;
	}

	this.setState({
	  nstripes: nstripes,
	  nwash: nwash,
	  ncacbcc: ncacbcc,
	  calcheck: calcheck,
	  ndesiccant: ndesiccant,
	  nlamina: nlamina,
	  ncontrol_focus: ncontrol_focus,
	  ncalibrator: ncalibrator,
	  ncleanser: ncleanser,
	  ndiluent: ndiluent,
	  display_form: 'none',
	  display_result: '',
	  only_chem: only_chem,
	  only_micro: only_micro,
	});
  }

  handleClick(event) {
	this.setState({
	  display_form: '',
	  display_result: 'none',
	});
  }

  renderForm() {
	return e(Form, {
	  working_days: this.state.working_days,
	  tests_chemistry: this.state.tests_chemistry,
	  tests_micro: this.state.tests_micro,
	  onChange: this.handleChange,
	  onSubmit: this.handleSubmit,
	  display_form: this.state.display_form,
	});
  }

  renderResult() {
	return e(Result, {
	  nstripes: this.state.nstripes,
	  nwash: this.state.nwash,
	  ncacbcc: this.state.ncacbcc,
	  calcheck: this.state.calcheck,
	  ndesiccant: this.state.ndesiccant,
	  nlamina: this.state.nlamina,
	  ncontrol_focus: this.state.ncontrol_focus,
	  ncalibrator: this.state.ncalibrator,
	  ncleanser: this.state.ncleanser,
	  ndiluent: this.state.ndiluent,
	  display_result: this.state.display_result,
	  onClick: this.handleClick,
	  only_chem: this.state.only_chem,
	  only_micro: this.state.only_micro,
	  working_days: this.state.working_days,
	  tests_chemistry: this.state.tests_chemistry,
	  tests_micro: this.state.tests_micro,
	});
  }

  render() {
	return e('div', null, this.renderForm(), this.renderResult());
  }
}

ReactDOM.render(
  e(IRIScalculator, null),
  document.getElementById('root')
);

function Form(props) {
  return e('form', {onSubmit: props.onSubmit, style: {display: props.display_form}},
	e('div', {className: 'row'},
	  e('div', {className: 'col-md'},
		e('div', {className: 'form-group'},
		  e('label', {htmlFor: 'working_days'}, 'Рабочих дней'),
		  e('div', {className: 'input-group'},
			e('input', {
			  type: 'number',
			  className: 'form-control', 
			  name: 'working_days',
			  id: 'working_days',
			  step: '1',
			  min: 0,
			  max: 366,
			  required: true,
			  value: props.working_days,
			  onChange: props.onChange,
			},),
			e('div', {className: 'input-group-append'}, e('div', {className: 'input-group-text'},'/год')),
		  ),
		  e('small', {className: 'form-text text-muted'}, 'Введите количество рабочих дней в году'),
		)
	  ),
	  e('div', {className: 'col-md'},
		e('div', {className: 'form-group'},
		  e('label', {htmlFor: 'tests_chemistry'}, 'Физ.хим анализов'),
		  e('div', {className: 'input-group'},
			e('input', {
			  type: 'number',
			  className: 'form-control', 
			  name: 'tests_chemistry',
			  id: 'tests_chemistry',
			  step: '1',
			  min: 0,
			  value: props.tests_chemistry,
			  onChange: props.onChange,
			},),
			e('div', {className: 'input-group-append'}, e('div', {className: 'input-group-text'},'/день')),
		  ),
		  e('small', {className: 'form-text text-muted'}, 'Введите количество анализов физико-химических свойств в день'),
		)
	  ),
	  e('div', {className: 'col-md'},
		e('div', {className: 'form-group'},
		  e('label', {htmlFor: 'tests_micro'}, 'Микроскопий'),
		  e('div', {className: 'input-group'},
			e('input', {
			  type: 'number',
			  className: 'form-control', 
			  name: 'tests_micro',
			  id: 'tests_micro',
			  step: '1',
			  min: 0,
			  value: props.tests_micro,
			  onChange: props.onChange,
			},),
			e('div', {className: 'input-group-append'}, e('div', {className: 'input-group-text'},'/день')),
		  ),
		  e('small', {className: 'form-text text-muted'}, 'Введите количество микроскопий мочевого осадка в день'),
		)
	  ),
	),
	e('div', {className: 'row'},
	  e('div', {className: 'col'},
		e('button', {className: 'btn btn-outline-primary float-right', type: 'submit', id: 'calculate'}, 'Вычислить')
	  )
	),
  );
}

function Result(props) {
  return e('div', {id: 'result', style: {display: props.display_result}},
	e('table', {className: 'table table-sm'},
	  e('tbody', null,
		e('tr', null,
		  e('td', null, 'Количество рабочих дней в году'),
		  e('td', null, props.working_days),
		),
		e('tr', {style: {display: props.only_micro ? 'none' : ''}},
		  e('td', null, 'Количество хим анализов в день'),
		  e('td', null, props.tests_chemistry),
		),
		e('tr', {style: {display: props.only_chem ? 'none' : ''}},
		  e('td', null, 'Количество микроскопий в день'),
		  e('td', null, props.tests_micro),
		),
	  ),
	),
	e('table', {className: 'table table-sm'},
	  e('thead', null, 
		e('tr', null,
		  e('th', {className: 'coll'}, 'Каталожный номер'),
		  e('th', {className: 'coll'}, 'Название реагента'),
		  e('th', {className: 'coll'}, 'Количество наборов'),
		)
	  ),
	  e('tbody', null, 
		e('tr', {style: {display: props.only_micro ? 'none' : ''}},
		  e('td', {className: 'coll'}, '800-7204'),
		  e('td', {className: 'coll'}, 'Тест-полоски'),
		  e('td', {className: 'coll text-center'}, props.nstripes),
		),
		e('tr', {style: {display: props.only_micro ? 'none' : ''}},
		  e('td', {className: 'coll'}, '800-7217'),
		  e('td', {className: 'coll'}, 'Раствор для промывки'),
		  e('td', {className: 'coll text-center'}, props.nwash),
		),
		e('tr', {style: {display: props.only_micro ? 'none' : ''}},
		  e('td', {className: 'coll'}, '800-7702'),
		  e('td', {className: 'coll'}, 'Контроли «CA/CB/CC»'),
		  e('td', {className: 'coll text-center'}, props.ncacbcc),
		),
		e('tr', {style: {display: props.only_micro ? 'none' : ''}},
		  e('td', {className: 'coll'}, '800-7703'),
		  e('td', {className: 'coll'}, 'Набор для проверки калибровки'),
		  e('td', {className: 'coll text-center'}, props.calcheck),
		),
		e('tr', {style: {display: props.only_micro ? 'none' : ''}},
		  e('td', {className: 'coll'}, 'B79319'),
		  e('td', {className: 'coll'}, 'Влагопоглотитель'),
		  e('td', {className: 'coll text-center'}, props.ndesiccant),
		),
		e('tr', {style: {display: props.only_chem ? 'none' : ''}},
		  e('td', {className: 'coll'}, '800-3236'),
		  e('td', {className: 'coll'}, 'Ламина'),
		  e('td', {className: 'coll text-center'}, props.nlamina),
		),
		e('tr', {style: {display: props.only_chem ? 'none' : ''}},
		  e('td', {className: 'coll'}, '800-3104'),
		  e('td', {className: 'coll'}, 'Контроль/фокус'),
		  e('td', {className: 'coll text-center'}, props.ncontrol_focus),
		),
		e('tr', {style: {display: props.only_chem ? 'none' : ''}},
		  e('td', {className: 'coll'}, '800-3103'),
		  e('td', {className: 'coll'}, 'Калибратор'),
		  e('td', {className: 'coll text-center'}, props.ncalibrator),
		),
		e('tr', null,
		  e('td', {className: 'coll'}, '800-3203'),
		  e('td', {className: 'coll'}, 'Очищающий раствор'),
		  e('td', {className: 'coll text-center'}, props.ncleanser),
		),
		e('tr', {style: {display: props.only_chem ? 'none' : ''}},
		  e('td', {className: 'coll'}, '800-3202'),
		  e('td', {className: 'coll'}, 'Дилюент'),
		  e('td', {className: 'coll text-center'}, props.ndiluent),
		),
	  ),
	),
	e('div', {className: 'row'},
	  e('div', {className: 'col d-none d-lg-block'},),
	  e('div', {className: 'col text-center d-none d-lg-block'},
		e('button', {className: 'btn btn-outline-secondary', onClick: () => window.print()}, 'Рапечатать'),
	  ),
	  e('div', {className: 'col'},
		e('button', {className: 'btn btn-outline-primary float-right', onClick: props.onClick}, 'Пересчитать'),
	  ),
	),
  );
}

function actual_tests_chemistry(tests_chemistry, working_days) {
  return tests_chemistry*working_days // actual patients results
  + 52*10 // clean GCC modul once a week
  + working_days*3 // tests for QC
  + 40 // cal check 4 times a year
  ;
}

function actual_volume_micro(tests_micro, working_days) {
  return tests_micro*working_days*lamina_patient // volume for patients
  + working_days*lamina_start_day // volume for clean/deluen/focus/QC before work
  + working_days*lamina_end_day // volume for clean/deluen after work
  + working_days*(session_per_day*lamina_session) // volume for two session a day (too optimistics)
  + 120*lamina_patient // volume for calibration per year
  ;
}

function n_wash_pack(tests, working_days) {
  return Math.ceil((tests*wash_patient+session_per_day*working_days*wash_session)/(2*wash_btl_volume));
}

function n_lamina_pack(volume) {
  return Math.ceil(volume/(2 * lamina_btl_volume));
}

function n_stripes_pack(tests) {
  return Math.ceil(tests/100);
}

function n_desiccant_pack(working_days) {
  return Math.ceil(working_days/30);
}
