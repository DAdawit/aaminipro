import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axios from 'axios'
const SingleUser = () => {
    const { userId } = useParams()
    const [user, setUser] = useState([])
    const [error, setError] = useState('')
    const [successMsg, setSuccessMesg] = useState('')
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:4000/api/users/${userId}`)
            console.log(response,'response')
            if (response.data) {
                setUser(response.data)
            }

        } catch (error) {
            setError('Something go wrong')
            console.log(error)
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [userId])
    let n= 1
    console.log(userId)
    return (
        <Table className='w-full'>
            <TableCaption>A list of Users.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Number</TableHead>
                    <TableHead>full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Age</TableHead>
                    <TableHead className="text-right">Gender</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">{n++}</TableCell>
                        <TableCell>{user.fullname}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right">{user.age}</TableCell>
                        <TableCell className="text-right">{user.sex}</TableCell>

                        {/* New Action Column */}
                        <TableCell>
                            <div className="flex items-center justify-end gap-4">
                                <button
                                    onClick={() => handleDelete(user?.id)}
                                    className="px-2 bg-red-400 hover:bg-red-600 cursor-pointer text-white rounded-sm"
                                >
                                    Delete
                                </button>
                                <Link
                                    to={`/users/update/${user?.id}`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Edit
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
           
            </TableBody>
        </Table>
    )
}

export default SingleUser
