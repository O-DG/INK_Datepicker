// ink_datepicker js lib

window.addEventListener('load', function (){
  datepicker_setting();
  // calendarInit();
});

// 0채워 넣기
Number.prototype.fillZero = function(width){
    let n = String(this);//문자열 변환
    return n.length >= width ? n:new Array(width-n.length+1).join('0')+n;//남는 길이만큼 0으로 채움
}
String.prototype.fillZero = function(width){
    return this.length >= width ? this:new Array(width-this.length+1).join('0')+this;//남는 길이만큼 0으로 채움
}
// 초기설정
function datepicker_setting(){
  let find_elements = i_date_find('i-datepicker');

  // 기능 인식 및 이벤트 이식
  for (var i = 0; i < find_elements.length; i++) {
    find_elements[i].setListenerDatepicker('i-datepicker', f_datepicker);
  }
}

// 요소의 기능 확인 및 활성화
Element.prototype.setListenerDatepicker = function (func_attr, functions) {
  if (this.hasAttribute(func_attr)){
    // input autocomplete off (자동완성 비활성화) > datepicker에 방해됨
    this.setAttribute('autocomplete', 'off');
    return this.addEventListener('click', functions);
  }
}

// ink utill find = ink 속성이 사용되는 기능 인식 및 검색
function i_date_find(attr , val) {
  let find_elements = val ? document.querySelectorAll('[' + attr + ']') : document.querySelectorAll('[' + attr + ']', val);
  // i-name 속성을 가진 요소 목록(배열) 반환
  return find_elements;
}


// 활성화
function f_datepicker(){
  if (!this.hasAttribute('readonly')) {
    const datepicker_wrap = document.createElement('div');

    datepicker_wrap.classList.add('ink_datepicker');
    datepicker_wrap.setAttribute('i-date', this.name);
    datepicker_wrap.innerHTML = `
      <div class="ink_datepicker_wrap">
        <div class="ink_datepicker_header">
          <a href="javascript:;" class="ink_datepicker_btn ink_datepicker_btn_prev">이전 달</a>
          <div class="ink_datepicker_title">
            <div class="ink_datepicker_year_wrap"></div>
            <div class="ink_datepicker_month_wrap"></div>
          </div>
          <a href="javascript:;" class="ink_datepicker_btn ink_datepicker_btn_next">다음 달</a>
        </div>
        <div class="ink_datepicker_table">
          <div class="ink_datepicker_days">
            <div class="ink_datepicker_day">일</div>
            <div class="ink_datepicker_day">월</div>
            <div class="ink_datepicker_day">화</div>
            <div class="ink_datepicker_day">수</div>
            <div class="ink_datepicker_day">목</div>
            <div class="ink_datepicker_day">금</div>
            <div class="ink_datepicker_day">토</div>
          </div>
          <div class="ink_datepicker_dates"></div>
        </div>
        <div class="ink_datepicker_menu">
          <div class="ink_datepicker_btn_wrap">
            <button type="button" name="button" class="ink_datepicker_btn today">오늘</button>
            <button type="button" name="button" class="ink_datepicker_btn reset">초기화</button>
            <button type="button" name="button" class="ink_datepicker_btn cancel">취소</button>
          </div>
        </div>
      </div>
      <div class="ink_datepicker_bg"></div>
    `;
    // 생성
    document.querySelector('body').appendChild(datepicker_wrap);

    // 옵션 인식
    let date_option = new Object();
    if (this.hasAttribute('i-min-year')) {
      date_option.minYear = this.getAttribute('i-min-year');
    }
    if (this.hasAttribute('i-max-year')) {
      date_option.maxYear = this.getAttribute('i-max-year');
    }
    // if (this.hasAttribute('i-min-month')) {
    //   date_option.minMonth = this.getAttribute('i-min-month') -1;
    // }
    // if (this.hasAttribute('i-max-month')) {
    //   date_option.maxMonth = this.getAttribute('i-max-month' -1);
    // }
    if (this.hasAttribute('i-sync-date-start')) {
      date_option.syncDateStart = this.getAttribute('i-sync-date-start');
    }
    if (this.hasAttribute('i-sync-date-end')) {
      date_option.syncDateEnd = this.getAttribute('i-sync-date-end');
    }

    // 데이터 주입
    return calendarInit(this, this.value, date_option);
  }

}



function calendarInit(input_box, input_date, date_option) {
    const wrap = document.querySelector('.ink_datepicker');

    // 날짜 정보 가져오기
    let date = new Date(); // 현재 날짜(로컬 기준) 가져오기
    let utc = date.getTime() + (date.getTimezoneOffset() * 60 * 1000); // uct 표준시 도출
    let kstGap = 9 * 60 * 60 * 1000; // 한국 kst 기준시간 더하기
    let today = new Date(utc + kstGap); // 한국 시간으로 date 객체 만들기(오늘)
    // 옵션 입력
    let minYear = date_option.minYear ? Number(date_option.minYear) : 4; // 최소 년도
    let maxYear = date_option.maxYear ? Number(date_option.maxYear) : 4; // 최대 년도
    let minMonth = date_option.minMonth ? Number(date_option.minMonth) - 1 : 0; // 최소 월 (-1 사용자 입력값을 재 정의)
    let maxMonth = date_option.maxMonth ? Number(date_option.maxMonth) - 1 : 11; // 최대 월
    let minDay = date_option.minDay ? Number(date_option.minDay) - 1 : 0; // 최소 일 - 처음 일자를 피하기 위해 32로 설정 (-1 사용자 입력값을 재 정의)
    let maxDay = date_option.maxDay ? Number(date_option.maxDay) + 1 : 32; // 최대 일 - 마지막 일자를 피하기 위해 32로 설정
    let syncDateStart = date_option.syncDateStart ? date_option.syncDateStart : false; // 연결 객체(datepicker info of input)
    let syncDateEnd = date_option.syncDateEnd ? date_option.syncDateEnd : false; // 연결 객체(datepicker info of input)

    // sync 연결 예제
    // <input type="text" name="start" value="" i-datepicker>
    // <input type="text" name="end" value="" i-datepicker i-sync-date="start">
    //
    // 최소치
    // <input type="text" name="start" value="" i-datepicker i-min-year="10">
    // <input type="text" name="end" value="" i-datepicker i-sync-date="start">

    // 연결 객체
    let syncObjStart = syncDateStart ? document.getElementsByName(syncDateStart)[0] : false;
    let syncObjEnd = syncDateEnd ? document.getElementsByName(syncDateEnd)[0] : false;

    // 연결 객체 날짜(입력 값)
    let syncObjDateStart = syncObjStart ? syncObjStart.value.split('-') : [today.getFullYear().toString(), today.getMonth().toString().fillZero(2), today.getDate().toString().fillZero(2)];
    let syncObjDateEnd = syncObjEnd ? syncObjEnd.value.split('-') : [today.getFullYear().toString(), (today.getMonth()+2).toString().fillZero(2), today.getDate().toString().fillZero(2)];

    // 0 일 경우 재설정
    if (syncObjDateStart < 1) {
      syncObjDateStart[0] = syncObjDateEnd[0];
    }
    if (syncObjDateEnd < 1) {
      syncObjDateEnd[0] = syncObjDateStart[0];
    }

    // 최소/최대 값 정의
    if (syncObjStart && syncObjDateStart != '') {
      // 초기 값
      minYear = today.getFullYear() - minYear;

      maxYear = Number(syncObjDateStart[0]) == 0 ? today.getFullYear() + 2 : Number(syncObjDateStart[0]);
      maxMonth = Number(syncObjDateStart[1]) - 1 == 0 ? today.getMonth() : Number(syncObjDateStart[1]);
      maxDay = Number(syncObjDateStart[2]) == 0 ? today.getDate() : Number(syncObjDateStart[2]);
    }else if (syncObjEnd && syncObjDateEnd != '') {
      // 초기 값
      minYear = Number(syncObjDateEnd[0]) == 0 ? today.getFullYear() - 4 : Number(syncObjDateEnd[0]);
      minMonth = Number(syncObjDateEnd[1]) - 1;
      minDay = Number(syncObjDateEnd[2]);

      maxYear = today.getFullYear() + maxYear;
    }else {
      // 초기값
      minYear = today.getFullYear() - minYear;
      // minMonth = today.getMonth() - minMonth;

      maxYear = today.getFullYear() + maxYear;
      // maxMonth = today.getMonth() + maxMonth;
    }

    // 년도 공식에 의한 음수와 양수 반전 변환
    minYear = minYear > 0 ? minYear * 1 : Math.abs(minYear);
    maxYear = maxYear < 0 ? maxYear * -1 : Math.abs(maxYear);
    // console.log(minYear);
    // console.log(maxYear);

    // 달력에서 표기하는 날짜
    let thisMonth = 0;
    if (input_date != '') {
      input_date = input_date.split('-');
      let what = input_date[2].split(' ');
      if (what[1]) {
        console.error('what is it? : ' + what[1] + ' Must to Delete this');
        input_date[2] = what[0];
      }
      // 0 구분
      if (input_date[0] == '0000') {
        // 현재 일자 입력
        thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      }else {
        // 입력받은 일자 입력
        thisMonth = new Date(input_date[0], input_date[1] - 1, input_date[2]);
      }
    }else {
      // 현재 일자 입력
      thisMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }

    // kst 기준 현재시간
    // console.log(thisMonth);

    // 렌더링을 위한 데이터 정리
    let currentYear;
    let currentMonth;
    let currentDate;
    // 첫 렌더 스위치
    let first_render = true;

    // 캘린더 렌더링
    if (syncObjStart) {
      renderCalender(thisMonth, syncObjStart);
    }else if (syncObjEnd) {
      renderCalender(thisMonth, syncObjEnd);
    }else {
      renderCalender(thisMonth);
    }

    function renderCalender(thisMonth, sync) {
      //  syncObj 여부에 따른 정의 (처음 창을 열 때만 구분 및 정의)
      sync = sync? sync : false;
      // 렌더링 직후, 초기 일자 정의
      if (sync && first_render) {
        // 첫 렌더 후, 년/월 선택으로 인한 렌더에 대한 대응
        if (sync.hasAttribute('i-sync-date-end')) {
          // 입력된 값, 연결된 값, 재 렌더 값 여부에 따라 재 정의
          currentYear = input_date != '' && input_date[0] != 0 ? thisMonth.getFullYear() : Number(syncObjDateStart[0]) ? Number(syncObjDateStart[0]) : thisMonth.getFullYear();
          currentMonth = input_date != '' && input_date[0] != 0  ? thisMonth.getMonth() : Number(syncObjDateStart[1]) ? Number(syncObjDateStart[1]) -1 : thisMonth.getMonth();
          currentDate = input_date != '' && input_date[0] != 0  ? thisMonth.getDate() : Number(syncObjDateStart[2]) ? Number(syncObjDateStart[2]) : thisMonth.getDate();
        }else if (sync.hasAttribute('i-sync-date-start')) {
          // 입력된 값, 연결된 값, 재 렌더 값 여부에 따라 재 정의
          currentYear = input_date != '' && input_date[0] != 0  ? thisMonth.getFullYear() : Number(syncObjDateEnd[0]) ? Number(syncObjDateEnd[0]) : thisMonth.getFullYear();
          currentMonth = input_date != '' && input_date[0] != 0  ? thisMonth.getMonth() : Number(syncObjDateEnd[1]) ? Number(syncObjDateEnd[1]) -1 : thisMonth.getMonth();
          currentDate = input_date != '' && input_date[0] != 0  ? thisMonth.getDate() : Number(syncObjDateEnd[2]) ? Number(syncObjDateEnd[2]) : thisMonth.getDate();
        }
      }else {
        currentYear = thisMonth.getFullYear();
        currentMonth = thisMonth.getMonth();
        currentDate = thisMonth.getDate();
      }
      // 첫 렌더 스위치
      first_render = false;
      // console.log('currentYear : ' + currentYear);
      // console.log('currentMonth : ' + currentMonth);
      // console.log('currentDate : ' + currentDate);
      // console.log('minYear : ' + minYear);
      // console.log('maxYear : ' + maxYear);
      // console.log('minMonth : ' + minMonth);
      // console.log('maxMonth : ' + maxMonth);
      // console.log('minDay : ' + minDay);
      // console.log('maxDay : ' + maxDay);
      // console.log('syncDateStart : ' + syncDateStart);
      // console.log('syncDateEnd : ' + syncDateEnd);

      // 이전 달의 마지막 날 날짜와 요일 구하기
      let startDay = new Date(currentYear, currentMonth, 0);
      let prevDate = startDay.getDate();
      let prevDay = startDay.getDay();
      // 이번 달의 마지막날 날짜와 요일 구하기
      let endDay = new Date(currentYear, currentMonth + 1, 0);
      let nextDate = endDay.getDate();
      let nextDay = endDay.getDay();

      // console.log(prevDate, prevDay, nextDate, nextDay);


      // 년도 표기(현재)
      const year_wrap = document.querySelector('.ink_datepicker_year_wrap');
      let year_box = document.createElement('select');
      year_wrap.innerHTML = '';  // 초기화
      // 생성
      year_box.classList.add('ink_datepicker_year');
      year_wrap.appendChild(year_box);

      // 최소 년도 ~ 최대 년도
      for (var i = minYear; i <= maxYear; i++) {
        // 년도 생성
        date_setYear(i);
      }

      // 년도 생성
      function date_setYear (i) {
        let in_options;
        // 현재 월 확인
        if (i == (currentYear)) {
          // 현재 년도 확인 시, 초기 선택 적용
          in_options = '<option value="'+currentYear+'" selected>'+currentYear+'년</option>';
        }else {
          // 년도 표기
          in_options = '<option value="'+i+'">'+i+'년</option>';
        }
        year_box.innerHTML += in_options;
      }

      // 월 표기(현재)
      const month_wrap = document.querySelector('.ink_datepicker_month_wrap');
      let month_box = document.createElement('select');
      month_wrap.innerHTML = '';  // 초기화
      // 생성
      month_box.classList.add('ink_datepicker_month');
      month_wrap.appendChild(month_box);

      // 최소 월 ~ 최대 월
      if (sync) {
        if (sync.hasAttribute('i-sync-date-end') && currentYear == Number(syncObjDateStart[0])) {
          // 시작일
          for (var i = minMonth; i <= maxMonth; i++) {
            // 월 생성
            date_setMonth(i);
          }
        }else if (sync.hasAttribute('i-sync-date-start') && currentYear == Number(syncObjDateEnd[0])) {
          // 종료일
          for (var i = minMonth; i <= maxMonth; i++) {
            // 월 생성
            date_setMonth(i);
          }
        }else {
          for (var i = 0; i < 12; i++) {
            // 월 생성
            date_setMonth(i);
          }
        }
      }else {
        for (var i = 0; i < 12; i++) {
          // 월 생성
          date_setMonth(i);
        }
      }

      // 월 생성
      function date_setMonth(i) {
        let in_options;

        // 현재 월 확인
        if (i == (currentMonth)) {
          // 현재 년도 확인 시, 초기 선택 적용
          in_options = '<option value="'+(currentMonth + 1)+'" selected>'+(currentMonth + 1)+'월</option>';
        }else {
          // 월 표기
          in_options = '<option value="'+i+'">'+(i + 1)+'월</option>';
        }
        month_box.innerHTML += in_options;
      }

      // 렌더링 html 요소 생성
      const calendar = document.querySelector('.ink_datepicker_dates');
      calendar.innerHTML = '';  // 초기화

      // 지난달
      for (var i = prevDate - prevDay; i <= prevDate; i++) {
        calendar.innerHTML = calendar.innerHTML + '<a href="javascript:void(0);" class="ink_datepicker_day prev disable">' + i + '</a>';
      }
      // 이번달
      for (var i = 1; i <= nextDate; i++) {
        if (sync) {
          if (sync.hasAttribute('i-sync-date-start') && currentYear == Number(syncObjDateEnd[0]) && currentMonth == Number(syncObjDateEnd[1]) - 1 ||
              sync.hasAttribute('i-sync-date-end') && currentYear == Number(syncObjDateStart[0]) && currentMonth == Number(syncObjDateStart[1]) - 1) {
            // 최소/최대 일자 구분 일 생성
            date_setDay(i);
          }else { // 입력 값이 없을 경우
            calendar.innerHTML = calendar.innerHTML + '<a href="javascript:void(0);" class="ink_datepicker_day this">' + i + '</a>';
          }
        }else { // 기본
          calendar.innerHTML = calendar.innerHTML + '<a href="javascript:void(0);" class="ink_datepicker_day this">' + i + '</a>';
        }

      }
      // 일 생성
      function date_setDay(i) {
        // 최소/최대 일자 구분
        if (minDay < i && maxDay > i) {
          calendar.innerHTML = calendar.innerHTML + '<a href="javascript:void(0);" class="ink_datepicker_day this">' + i + '</a>';
        }else {
          calendar.innerHTML = calendar.innerHTML + '<a href="javascript:void(0);" class="ink_datepicker_day this disable">' + i + '</a>';
        }
      }
      // 다음달
      for (var i = 1; i <= (7 - nextDay - 1 == 7 ? 0 : 7 - nextDay - 1); i++) {
        calendar.innerHTML = calendar.innerHTML + '<a href="javascript:void(0);" class="ink_datepicker_day next disable">' + i + '</a>';
      }

      // 오늘일자 표기
      if (today.getFullYear() == currentYear && today.getMonth() == currentMonth) {
        var currentMonthDate = document.querySelectorAll('.ink_datepicker_dates .this');
        currentMonthDate[today.getDate()-1].classList.add('today');
      }
      // 선택일자 표기
      if (currentYear == input_date[0] && currentMonth == (input_date[1] - 1)) {
        var currentMonthDate = document.querySelectorAll('.ink_datepicker_dates .this');
        currentMonthDate[input_date[2]-1].classList.add('current');
      }

      // 년도 선택
      document.querySelector('.ink_datepicker_year').addEventListener('change', function (){
        thisMonth = new Date(year_box.options[year_box.selectedIndex].value, currentMonth, 1);
        return sync ? renderCalender(thisMonth, sync) : renderCalender(thisMonth);
      });

      // 월 선택
      document.querySelector('.ink_datepicker_month').addEventListener('change', function (){
        thisMonth = new Date(currentYear, month_box.options[month_box.selectedIndex].value, 1);
        return sync ? renderCalender(thisMonth, sync) : renderCalender(thisMonth);
      });


      // 일자 버튼 일괄등록
      let day_btn = document.querySelectorAll('.ink_datepicker_day.this');

      for (var i = 0; i < day_btn.length; i++) {
        if (sync) {
          if (sync.hasAttribute('i-sync-date-start') && currentYear == Number(syncObjDateEnd[0]) && currentMonth == Number(syncObjDateEnd[1]) - 1) {
            day_add_function(i);
          }else if (sync.hasAttribute('i-sync-date-end') && currentYear == Number(syncObjDateStart[0]) && currentMonth == Number(syncObjDateStart[1]) - 1) {
            day_add_function(i);
          }else {
            day_btn[i].addEventListener('click', day_input_change);
          }
        }else {
          day_btn[i].addEventListener('click', day_input_change);
        }
      }

      // 최소/최대 일자 반환
      function day_add_function(i) {
        // 최소/최대 일 제외
        if ((minDay - 1) < i && (maxDay - 1) > i) {
          day_btn[i].addEventListener('click', day_input_change);
        }
      }

      // 일자 버튼 (선택일자 입력)
      function day_input_change() {
        // datepicker를 활성화 시킨 input의 값을 변경 (선택일자)
        // input_box.setAttribute('value', currentYear + '-' + (currentMonth + 1).fillZero(2) + '-' + this.innerText.fillZero(2));
        input_box.value = currentYear + '-' + (currentMonth + 1).fillZero(2) + '-' + this.innerText.fillZero(2);
        // datepicker 끄기
        return wrap.remove();
      }

      return;
    }

    // 이전달로 이동
    document.querySelector('.ink_datepicker_btn_prev').addEventListener('click', function (){
      event.stopPropagation();
      event.preventDefault();

      // 최소치 이전 이동 불가능
      if (currentYear <= minYear && currentMonth == minMonth) {
        alert('더 이상 이전 달로 이동할 수 없습니다.');
        thisMonth = new Date(currentYear, currentMonth, 1);
      }else {
        thisMonth = new Date(currentYear, currentMonth - 1, 1);
      }

      if (syncObjStart) {
        return renderCalender(thisMonth, syncObjStart);
      }else if (syncObjEnd) {
        return renderCalender(thisMonth, syncObjEnd);
      }else {
        return renderCalender(thisMonth);
      }
    });

    // 다음달로 이동
    document.querySelector('.ink_datepicker_btn_next').addEventListener('click', function (){
      event.stopPropagation();
      event.preventDefault();

      // 최대 년도 다음 이동 불가능
      if (currentYear >= maxYear && currentMonth == maxMonth) {
        alert('더 이상 다음 달로 이동할 수 없습니다.');
        thisMonth = new Date(currentYear, currentMonth, 1);
      }else {
        thisMonth = new Date(currentYear, currentMonth + 1, 1);
      }

      if (syncObjStart) {
        return renderCalender(thisMonth, syncObjStart);
      }else if (syncObjEnd) {
        return renderCalender(thisMonth, syncObjEnd);
      }else {
        return renderCalender(thisMonth);
      }
    });

    // 취소 버튼
    document.querySelector('.ink_datepicker_btn.cancel').addEventListener('click', function (){
      event.preventDefault();
      // datepicker 끄기
      return wrap.remove();
    });
    // 달력 밖 클릭(오버랩 배경) - 취소
    document.querySelector('.ink_datepicker_bg').addEventListener('click', function (){
      event.preventDefault();
      // datepicker 끄기
      return wrap.remove();
    });
    // 오늘 버튼
    document.querySelector('.ink_datepicker_btn.today').addEventListener('click', function (){
      event.preventDefault();
      // datepicker를 활성화 시킨 input의 값을 변경 (오늘)
      // input_box.setAttribute('value', today.getFullYear() + '-' + (today.getMonth() + 1).fillZero(2) + '-' + today.getDate().fillZero(2));
      input_box.value = today.getFullYear() + '-' + (today.getMonth() + 1).fillZero(2) + '-' + today.getDate().fillZero(2);
      // datepicker 끄기
      return wrap.remove();
    });
    // 초기화 버튼
    document.querySelector('.ink_datepicker_btn.reset').addEventListener('click', function (){
      event.preventDefault();
      // datepicker를 활성화 시킨 input의 값을 변경 (초기화)
      // input_box.setAttribute('value', '');
      input_box.value = '';
      // datepicker 끄기
      return wrap.remove();
    });
    return;
}
