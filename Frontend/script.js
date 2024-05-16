document.addEventListener('DOMContentLoaded', async () => {
  const characterForm = document.getElementById('characterForm');
  const characterList = document.getElementById('characterList');
  const itemList = document.getElementById('itemList');
  let detailBtn = document.querySelectorAll('.detail');
  

  // 캐릭터 등록 이벤트
  characterForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(characterForm);
    const name = formData.get('name');

    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Character registration failed');
      }

      const data = await response.json();
      console.log('Character registered successfully:', data);

      // Refresh character list
      await refreshCharacterList();
    } catch (error) {
      console.error('Error registering character:', error);
    }
  });

  // 캐릭터 목록 조회 함수
  async function refreshCharacterList() {
    characterList.innerHTML = '';

    try {
      const response = await fetch('/api/characters');
      const data = await response.json();

      data.characters.forEach((character) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${character.name} <button class="detail" data-chardetail="${character._id}">상세정보</button><button class="deleteBtn" data-characterid="${character._id}">삭제</button>`;
        characterList.appendChild(listItem);
      });

      // 삭제 및 상세정보 버튼 이벤트 처리
      const deleteBtn = document.querySelectorAll('.deleteBtn');
      deleteBtn.forEach((button) => {
        button.addEventListener('click', async () => {
          const characterId = button.dataset.characterid;
          try {
            const response = await fetch(`/api/characters/${characterId}`, {
              method: 'DELETE',
            });
            if (!response.ok) {
              throw new Error('캐릭터 삭제에 실패하였습니다.');
            }
            // 캐릭터 목록 갱신
            await refreshCharacterList();
          } catch (error) {
            console.error('Error deleting character', error);
          }
        });
      });

      detailBtn = document.querySelectorAll('.detail');
      detailBtn.forEach((button) => {
        button.addEventListener('click', async () => {
          const characterId = button.dataset.chardetail;
          try {
            const response = await fetch(`/api/characters/${characterId}`, {
              method: 'GET',
            });
            const data = await response.json();
            if (response.ok) {
              alert(
                `캐릭터 이름: ${data.data.name}, 체력: ${data.data.health}, 공격력: ${data.data.power}`
              );
            } else {
              throw new Error('상세 정보를 가져오는데 실패했습니다.');
            }
          } catch (error) {
            console.error('Error fetching character detail:', error);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching character list:', error);
    }
  }

  // 아이템 추가 함수
  async function refreshItemList() {
    itemList.innerHTML = '';
    try {
      const response = await fetch('/api/items');
      const data = await response.json();

      data.items.forEach((item) => {
        const itemLi = document.createElement('li');
        itemLi.innerHTML = `item_code : ${item.item_code}, item_name : ${item.item_name} <button class="itemDetail" data-itemdetail="${item._id}">상세정보</button>`;
        itemList.appendChild(itemLi);
      });
      // 아이템 상세정보 클릭 이벤트
      const itemDetailBtn = document.querySelectorAll('.itemDetail');
      itemDetailBtn.forEach((button) => {
        button.addEventListener('click', async () => {
          const itemId = button.dataset.itemdetail;
          try {
            const response = await fetch(`/api/items/${itemId}`, {
              method: 'GET',
            });
            const data = await response.json();
            if (response.ok) {
                console.log('ok');
              alert(
                `아이템 코드: ${data.data.item_code}, 아이템 이름: ${data.data.item_name}, 체력 : ${data.data.item_stat.health}, 공격력 : ${data.data.item_stat.power}`
              );
            } else {
              throw new Error('상세 정보를 가져오는데 실패했습니다.');
            }
          } catch (error) {
            console.error('Error fetching character detail:', error);
          }
        });
      });
    } catch (error) {
      console.error('Error fetching item list:', error);
    }
  }

  // Initial character list refresh
  await refreshCharacterList();
  await refreshItemList();
});
