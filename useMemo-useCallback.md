# useMemo vs useCallback 차이점 정리

link: https://velog.io/@khy226/useMemo%EC%99%80-useCallback-%ED%9B%91%EC%96%B4%EB%B3%B4%EA%B8%B0

## 핵심 차이점

### useMemo: **값(Value)을 메모이제이션**

```typescript
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])
```

### useCallback: **함수(Function)를 메모이제이션**

```typescript
const expensiveFunction = useCallback(() => {
  heavyCalculation(data)
}, [data])
```

## 구체적인 예시로 비교

### 1. 계산 결과를 메모이제이션 (useMemo)

```typescript
const Component = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);

  // 계산 결과를 메모이제이션
  const result = useMemo(() => {
    console.log('계산 실행됨!');
    return count * multiplier;
  }, [count, multiplier]);

  return (
    <div>
      <p>결과: {result}</p>
      <button onClick={() => setCount(count + 1)}>카운트 증가</button>
      <button onClick={() => setMultiplier(multiplier + 1)}>배수 증가</button>
    </div>
  );
};
```

### 2. 함수를 메모이제이션 (useCallback)

```typescript
const Component = () => {
  const [count, setCount] = useState(0);
  const [multiplier, setMultiplier] = useState(2);

  // 함수를 메모이제이션
  const calculateResult = useCallback(() => {
    console.log('함수 실행됨!');
    return count * multiplier;
  }, [count, multiplier]);

  return (
    <div>
      <p>결과: {calculateResult()}</p>
      <button onClick={() => setCount(count + 1)}>카운트 증가</button>
      <button onClick={() => setMultiplier(multiplier + 1)}>배수 증가</button>
    </div>
  );
};
```

## 언제 무엇을 사용할까?

### useMemo 사용 케이스

#### 1. **복잡한 계산 결과**

```typescript
const Component = ({ items }) => {
  // 복잡한 필터링과 정렬
  const processedItems = useMemo(() => {
    return items
      .filter(item => item.active)
      .sort((a, b) => a.priority - b.priority)
      .map(item => ({ ...item, processed: true }));
  }, [items]);

  return <ItemList items={processedItems} />;
};
```

#### 2. **객체나 배열 생성**

```typescript
const Component = ({ user }) => {
  // 매번 새로운 객체 생성 방지
  const userConfig = useMemo(() => ({
    theme: user.preferences.theme,
    language: user.preferences.language,
    notifications: user.settings.notifications
  }), [user.preferences, user.settings]);

  return <UserSettings config={userConfig} />;
};
```

### useCallback 사용 케이스

#### 1. **자식 컴포넌트에 함수 전달**

```typescript
const Parent = () => {
  const [count, setCount] = useState(0);

  // 자식 컴포넌트가 불필요하게 리렌더링되지 않도록
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return <Child onIncrement={handleIncrement} />;
};

const Child = React.memo(({ onIncrement }) => {
  console.log('Child 리렌더링됨');
  return <button onClick={onIncrement}>증가</button>;
});
```

#### 2. **useEffect의 의존성**

```typescript
const Component = ({ userId }) => {
  const fetchUser = useCallback(async () => {
    const user = await api.getUser(userId)
    setUser(user)
  }, [userId])

  useEffect(() => {
    fetchUser()
  }, [fetchUser]) // fetchUser가 변경되지 않으면 useEffect 재실행 안됨
}
```

## 실제 성능 비교

### useMemo 예시

```typescript
const Component = ({ data }) => {
  // data가 변경될 때만 계산 실행
  const expensiveResult = useMemo(() => {
    console.log('복잡한 계산 실행!');
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  return <div>{expensiveResult}</div>;
};
```

### useCallback 예시

```typescript
const Component = ({ data }) => {
  // data가 변경될 때만 함수 재생성
  const handleClick = useCallback(() => {
    console.log('클릭 처리!');
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    console.log('합계:', sum);
  }, [data]);

  return <button onClick={handleClick}>클릭</button>;
};
```

## 같은 기능을 다른 방식으로 구현 (비추천)

### useMemo로 함수 메모이제이션 (어색함)

```typescript
const Component = () => {
  const [count, setCount] = useState(0);

  // ❌ useMemo로 함수를 메모이제이션 (어색함)
  const handleClick = useMemo(() => {
    return () => {
      setCount(count + 1);
    };
  }, [count]);

  return <button onClick={handleClick}>클릭</button>;
};
```

### useCallback으로 값 메모이제이션 (어색함)

```typescript
const Component = () => {
  const [count, setCount] = useState(0);

  // ❌ useCallback으로 값을 메모이제이션 (어색함)
  const result = useCallback(() => {
    return count * 2;
  }, [count])(); // 즉시 실행

  return <div>{result}</div>;
};
```

## 요약표

| 구분                  | useMemo                                        | useCallback                                    |
| --------------------- | ---------------------------------------------- | ---------------------------------------------- |
| **메모이제이션 대상** | 값 (계산 결과, 객체, 배열)                     | 함수                                           |
| **사용 시기**         | 복잡한 계산 결과를 캐시할 때                   | 함수를 props로 전달하거나 의존성으로 사용할 때 |
| **반환값**            | 메모이제이션된 값                              | 메모이제이션된 함수                            |
| **예시**              | `const result = useMemo(() => calc(), [deps])` | `const fn = useCallback(() => {}, [deps])`     |

## 핵심 포인트

**`useMemo`는 "무엇을" 메모이제이션하고, `useCallback`은 "어떻게" 메모이제이션합니다!**

- **useMemo**: 계산 결과나 객체를 캐시하여 불필요한 재계산 방지
- **useCallback**: 함수를 캐시하여 불필요한 함수 재생성 방지
