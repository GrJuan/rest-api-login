//IMPORTS ORM
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

//IMPORTS DEPENDENCIES
import { IsNotEmpty, MinLength, IsEmail, IsOptional, IsDateString } from "class-validator";
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNotEmpty()
    firstName: string

    @Column()
    @IsNotEmpty()
    lastName: string

    @Column()
    @MinLength(6)
    @IsEmail()
    @IsNotEmpty()
    email: string

    @Column()
    @IsNotEmpty()
    age: number

    @Column()
    @IsNotEmpty()
    phone: number;

    @Column()
    @IsNotEmpty()
    country: string

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    password: string

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updateAt: Date;

    @Column()
    @IsDateString()
    activityDate: Date;

    @Column()
    @IsOptional()
    status: boolean;

    @Column()
    @IsOptional()
    role: string;

    @Column()
    @IsOptional()
    resetToken: string;
    
    @Column()
    @IsOptional()
    activationCode: string;

    hashPassword(): void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

}

