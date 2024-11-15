import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilPostsComponent } from './perfil-posts.component';

describe('PerfilPostsComponent', () => {
  let component: PerfilPostsComponent;
  let fixture: ComponentFixture<PerfilPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPostsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
