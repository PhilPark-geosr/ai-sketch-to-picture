import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
type ResponseValue = Todo[] // 할 일 목록

export interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}
const URL = 'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos'

export const useFetchTodos = () => {
  return useQuery<ResponseValue>({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: 'KDT8_bcAWVpD8',
          username: 'KDT8_ParkYoungWoong'
        }
      })

      const data = await res.json()
      // console.log(data)
      return data
    }
  })
}

export const useCreateTodo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: 'KDT8_bcAWVpD8',
          username: 'KDT8_ParkYoungWoong'
        },
        body: JSON.stringify({
          title: title
        })
      })
      const data = await res.json()
      console.log('post data', data)
      return data as Promise<Todo> //타입을 단언한다
    },
    //낙관적 업데이트 용
    // mutateFn 이 받는 인수를 똑같이 받을 수 있다.
    onMutate: title => {
      const newTodo = { id: Math.random().toString(), title }
      const prevTodos = queryClient.getQueryData<ResponseValue>(['todos'])

      if (prevTodos) {
        // protect type
        queryClient.setQueryData(['todos'], [newTodo, ...prevTodos])
      }
    },
    // 실제로 성공했을 때
    onSuccess: async () => {
      console.log(
        '무효화 하기 전 데이터',
        queryClient.getQueryData<ResponseValue>(['todos'])
      )
      await queryClient.invalidateQueries({ queryKey: ['todos'] })
      // onMutate로 임시 데이터를 무효화하고(queryKey로 캐시된 데이터를 무효화해!),
      //그렇게 되면 서버에서 데이터를 다시 가져온다

      console.log(
        '무효화 한 후 데이터',
        queryClient.getQueryData<ResponseValue>(['todos'])
      )
    },
    onError: () => {}
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todoBylocal: Todo) => {
      //서버로 전송하는 코드 필요
      const res = await fetch(
        `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todoBylocal.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            apikey: 'KDT8_bcAWVpD8',
            username: 'KDT8_ParkYoungWoong'
          },
          body: JSON.stringify({
            title: todoBylocal.title,
            done: todoBylocal.done
          })
        }
      )
      const data = await res.json()
      console.log('post data', data)
      return data as Promise<Todo> //타입을 단언한다
    },
    // mutateFn과 같이 실행됨, 이유 : 낙관적 업데이트
    // 여기서 todo : mutationFn에 넘어오는 todo
    onMutate: (todoBylocal: Todo) => {
      const todos = queryClient.getQueryData<Todo[]>(['todos'])
      if (todos) {
        queryClient.setQueryData(
          ['todos'],
          todos.map(t => {
            return t.id === todoBylocal.id ? todoBylocal : t
          })
        )
      }
    },
    // 갱신 성공 이후
    // 인수로 mutateFn실행결과가 넘어옴
    onSuccess: (todoByServer: Todo, todoBylocal: Todo) => {},
    onError: () => {}
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todoBylocal: Todo) => {
      //서버로 전송하는 코드 필요
      const res = await fetch(
        `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todoBylocal.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            apikey: 'KDT8_bcAWVpD8',
            username: 'KDT8_ParkYoungWoong'
          }
        }
      )
      const data = await res.json()
      return data as Promise<Todo> //타입을 단언한다
    },
    // mutateFn과 같이 실행됨, 이유 : 낙관적 업데이트
    // 여기서 todo : mutationFn에 넘어오는 todo
    onMutate: (todoBylocal: Todo) => {
      // 캐시된 데이터 가져오기
      const todos = queryClient.getQueryData<Todo[]>(['todos'])
      if (todos) {
        queryClient.setQueryData(
          ['todos'],
          todos.filter(t => t.id !== todoBylocal.id)
        )
      }
    },
    // 갱신 성공 이후
    // 인수로 mutateFn실행결과가 넘어옴
    onSuccess: (todoByServer: Todo, todoBylocal: Todo) => {},
    onError: () => {},
    onSettled: () => {} //finally랑 같은 개념
  })
}

// useMutation 의 구조
// export function useCustomHook() {
//   return useMutation({
//     // mutationFn와 onMutate의 인수를 사용자가 입력한 인수를 같이 받을 수 있다.
//     mutationFn: async (userInput: string) => {
//       // throw new Error('에러 발생!!')
//       return b as number
//     },
//     onMutate: userInput => {
//       return c as boolean
//     },
//     // b : mutation Function 에서 반환하는 값
//     // c : onMutate에서 반환하는 값
//     onSuccess: (b, userInput, c) => {},
//     onError: (err, userInput, c) => {},

//     // 성공 실패와 관계없이 항상 실행
//     // (mutateFn 성공 데이터, mutateFn 실패 데이터, 사용자가 입력한 데이터, onMutate가 반환하는 데이터)
//     onSettled: (b, err, userInput, c) => {} // finally
//   })
// }
