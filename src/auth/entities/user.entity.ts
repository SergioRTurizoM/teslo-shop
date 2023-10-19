import { IsArray, IsBoolean, IsEmail, IsString } from 'class-validator';
import { Product } from 'src/products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  email: string;

  @Column('text', {
    nullable: false,
    select: false,
  })
  password: string;

  @Column('text', {
    nullable: false,
  })
  fullName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];


  @OneToMany(
    ()=> Product,
    ( product)=> product.user
  )
  product: Product;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert;
  }
}
