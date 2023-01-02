import { DataSource, EntitySubscriberInterface, EventSubscriber } from 'typeorm';

import { __Template__Entity } from './template-file.entity';

@EventSubscriber()
export class __Template__Subscriber implements EntitySubscriberInterface<__Template__Entity> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return __Template__Entity;
  }
}
