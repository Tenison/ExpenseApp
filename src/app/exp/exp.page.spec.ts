import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExpPage } from './exp.page';

describe('ExpPage', () => {
  let component: ExpPage;
  let fixture: ComponentFixture<ExpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
