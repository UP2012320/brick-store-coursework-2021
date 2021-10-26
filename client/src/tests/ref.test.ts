import Ref from 'Scripts/framework/ref';

test('ref constructor assigns value', () => {
  const ref = new Ref(0);

  expect(ref.value).toBe(0);
});

test('ref replicates changes to value even with value types', () => {
  const ref = new Ref(0);

  const func1 = () => {
    ref.value = 1;
  };

  const func2 = () => {
    expect(ref.value).toBe(1);
  };

  func1();
  func2();
});
