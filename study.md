## UseMemo hook

### useMemo란?

- useMemo는 메모이제이션(Memoization)을 위한 React Hook입니다. 계산 비용이 큰 값이나 객체를 캐시하여 불필요한 재계산을 방지합니다.

📝 기본 문법

```ts
const memoizedValue = useMemo(() => {
  // 계산 비용이 큰 작업
  return computedValue;
}, [dependency1, dependency2, ...]);
```

### useMemo 훅 특징

1. 다른 상태가 바뀌어서 리렌더링되어도
2. 의존성 배열의 값들이 변경되지 않으면
3. 내부 함수를 다시 실행하지 않고
4. 이전에 계산된 값을 그대로 반환합니다

### React의 메모이제이션 동작 원리

React는 내부적으로 의존성 배열의 각 값을 이전 값과 비교합니다:

```ts
// React 내부 동작 (의사 코드)
function useMemo(create, deps) {
  const prevDeps = useRef(deps)

  // 의존성 배열의 각 값이 이전과 같은지 확인
  const depsChanged = deps.some((dep, index) => {
    return dep !== prevDeps.current[index]
  })

  if (depsChanged) {
    // 의존성이 변경되었으면 새로 계산
    const newValue = create()
    prevDeps.current = deps
    return newValue
  } else {
    // 의존성이 같으면 이전 값 반환
    return prevValue
  }
}
```

# ReactNative 특징

## 스타일링

**CSS가 자식으로 상속되지 않는다**

- 자식프로퍼티에 직접 설정해줘야 한다

```tsx
;<View style={styles.goalsContainer}>
  <ScrollView>
    {todos.map((todo: TodoState) => (
      <View
        key={Math.random()}
        style={styles.goalItem}>
        <Text style={styles.goalText}>{todo.content}</Text>
      </View>
    ))}
  </ScrollView>
</View>

const styles = StyleSheet.create({
  goalsContainer: {
    flex: 5
  },
  goalItem: {
    margin: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#5e0acc'
  },
  goalText: {
    color: 'white'
  }
})
```
