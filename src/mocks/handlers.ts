import { http, HttpResponse } from 'msw'

export const handlers = [
  // GET 요청: 데이터 가져오기 (ex. 사용자 프로필)
  http.get('https://api.example.com/user', () => {
    console.log('MSW: 가짜 유저 데이터를 보냅니다!')
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),

  // POST 요청: 데이터 보내기 (ex. 로그인)
  http.post('https://api.example.com/login', async ({ request }) => {
    const info = await request.json()
    console.log('MSW: 로그인 요청을 받았습니다:', info)

    return HttpResponse.json(
      { message: '로그인 성공!', user: info },
      { status: 201 }
    )
  }),
]