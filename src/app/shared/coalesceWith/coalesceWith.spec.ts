import { TestScheduler } from 'rxjs/testing';

import { jestMatcher } from './marbles/jest.observable-matcher';

describe('coalesceWith', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler(jestMatcher);
  });

  it('should coalesce sync emissions to microTask', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const source = cold('---(ab)--(ab)--(ab)|');
    });
  });

  it('should emit last value if source completes before durationSelector', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const source = cold('---a 100ms b|');
    });
  });

  it('should emit last value when durationSelector completes', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const source = cold('---a 400ms b 100ms |');
      const coalesingMarbles = '-----|';
    });
  });
});
