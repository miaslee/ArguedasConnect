import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreateGrupoComponent } from './post-create-grupo.component';

describe('PostCreateGrupoComponent', () => {
  let component: PostCreateGrupoComponent;
  let fixture: ComponentFixture<PostCreateGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCreateGrupoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCreateGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
